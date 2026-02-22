import time
import threading
from core.database import SessionLocal
from models.stream import Stream
from services.video_processor import process_stream
import asyncio

# Keep track of running threads
running_threads = {} # stream_id -> Thread

def run_processor(stream_id):
    # Wrapped in a new event loop for each thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(process_stream(stream_id))
    except Exception as e:
        print(f"[!] Thread Error for {stream_id}: {e}")
    finally:
        loop.close()

def orchestrate():
    print("=" * 60)
    print("SENTINEL AI - MULTI-THREADED ORCHESTRATOR")
    print("=" * 60)
    
    while True:
        db = SessionLocal()
        try:
            active_streams = db.query(Stream).filter(Stream.status == "active").all()
            
            # Start new threads
            for stream in active_streams:
                s_id = str(stream.id)
                if s_id not in running_threads or not running_threads[s_id].is_alive():
                    print(f"[+] Launching Neural Thread for: {stream.name}")
                    thread = threading.Thread(target=run_processor, args=(s_id,), daemon=True)
                    thread.start()
                    running_threads[s_id] = thread
            
            # Clean up tracking dict
            dead_threads = [sid for sid, t in running_threads.items() if not t.is_alive()]
            for sid in dead_threads:
                del running_threads[sid]
                
        except Exception as e:
            print(f"[!] Orchestrator Error: {e}")
            db.rollback()
        finally:
            db.close()
            
        time.sleep(5)

if __name__ == "__main__":
    try:
        orchestrate()
    except KeyboardInterrupt:
        print("\n[!] Orchestrator SIGINT received. Shutting down...")
