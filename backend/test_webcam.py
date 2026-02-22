import cv2
cap = cv2.VideoCapture(0)
if cap.isOpened():
    ret, frame = cap.read()
    if ret:
        print("[+] Webcam 0 is WORKING. Captured frame size:", frame.shape)
    else:
        print("[-] Webcam 0 opened but failed to read frame.")
    cap.release()
else:
    print("[-] Webcam 0 FAILED to open.")
