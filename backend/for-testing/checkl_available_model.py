from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

print("Available models:")
try:
    models = client.models.list()
    for model in models:
        print(f"- {model.name}")
except Exception as e:
    print(f"Error: {e}")