from urllib.parse import quote_plus

password = "7*aef@QY3C"
encoded = quote_plus(password)
print(f"Original password: {password}")
print(f"URL-encoded password: {encoded}")
print(f"\nDatabase URL:")
print(f"postgresql://sentinel:{encoded}@localhost:5432/sentineldb")
