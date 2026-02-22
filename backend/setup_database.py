"""
Database setup script for Sentinel AI
This script will create the database and user if they don't exist
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connection parameters for the default postgres database
DEFAULT_DB_PARAMS = {
    'host': 'localhost',
    'port': 5432,
    'user': 'postgres',  # Default PostgreSQL superuser
    'password': '',  # You'll need to enter your postgres password
    'database': 'postgres'
}

# Target database configuration
TARGET_USER = 'sentinel'
TARGET_PASSWORD = '7*aef@QY3C'
TARGET_DB = 'sentineldb'

def create_database():
    """Create the Sentinel database and user"""
    try:
        # Connect to default postgres database
        print("Connecting to PostgreSQL...")
        conn = psycopg2.connect(**DEFAULT_DB_PARAMS)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute(f"SELECT 1 FROM pg_roles WHERE rolname='{TARGET_USER}'")
        user_exists = cursor.fetchone()
        
        if not user_exists:
            print(f"Creating user '{TARGET_USER}'...")
            cursor.execute(f"CREATE USER {TARGET_USER} WITH PASSWORD '{TARGET_PASSWORD}'")
            print(f"✓ User '{TARGET_USER}' created successfully")
        else:
            print(f"✓ User '{TARGET_USER}' already exists")
        
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname='{TARGET_DB}'")
        db_exists = cursor.fetchone()
        
        if not db_exists:
            print(f"Creating database '{TARGET_DB}'...")
            cursor.execute(f"CREATE DATABASE {TARGET_DB} OWNER {TARGET_USER}")
            print(f"✓ Database '{TARGET_DB}' created successfully")
        else:
            print(f"✓ Database '{TARGET_DB}' already exists")
        
        # Grant privileges
        cursor.execute(f"GRANT ALL PRIVILEGES ON DATABASE {TARGET_DB} TO {TARGET_USER}")
        print(f"✓ Privileges granted to '{TARGET_USER}'")
        
        cursor.close()
        conn.close()
        
        print("\n✅ Database setup completed successfully!")
        print(f"\nConnection details:")
        print(f"  Host: localhost")
        print(f"  Port: 5432")
        print(f"  Database: {TARGET_DB}")
        print(f"  User: {TARGET_USER}")
        print(f"  Password: {TARGET_PASSWORD}")
        
    except psycopg2.Error as e:
        print(f"\n❌ Error: {e}")
        print("\nPlease make sure:")
        print("1. PostgreSQL is running")
        print("2. You have the correct postgres superuser password")
        print("3. You can connect to PostgreSQL")
        
if __name__ == "__main__":
    print("=" * 60)
    print("Sentinel AI - Database Setup")
    print("=" * 60)
    print()
    
    # Prompt for postgres password
    import getpass
    password = getpass.getpass("Enter your PostgreSQL 'postgres' user password: ")
    DEFAULT_DB_PARAMS['password'] = password
    
    create_database()
