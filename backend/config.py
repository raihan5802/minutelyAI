from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if GOOGLE_API_KEY is None or GOOGLE_API_KEY == "":
    raise ValueError("GOOGLE_API_KEY not found. Make sure it is set in your .env file.")

print("Config loaded — GOOGLE_API_KEY found.")
