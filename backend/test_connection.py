"""Test database connection"""
import psycopg2
from urllib.parse import quote_plus

# Test connection parameters
params = {
    'host': 'localhost',
    'port': 5432,
    'user': 'sentinel',
    'password': '7*aef@QY3C',
    'database': 'sentineldb'
}

print("Testing database connection...")
print(f"Host: {params['host']}")
print(f"Port: {params['port']}")
print(f"User: {params['user']}")
print(f"Database: {params['database']}")
print()

try:
    conn = psycopg2.connect(**params)
    print("✅ Connection successful!")
    
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"PostgreSQL version: {version[0]}")
    
    cursor.close()
    conn.close()
    
    # Test SQLAlchemy URL encoding
    print("\n" + "="*60)
    print("SQLAlchemy URL encoding test:")
    encoded_password = quote_plus(params['password'])
    url = f"postgresql://{params['user']}:{encoded_password}@{params['host']}:{params['port']}/{params['database']}"
    print(f"Encoded URL: {url}")
    
except psycopg2.Error as e:
    print(f"❌ Connection failed: {e}")
    print("\nPlease check:")
    print("1. PostgreSQL is running")
    print("2. Database 'sentineldb' exists")
    print("3. User 'sentinel' has access")
