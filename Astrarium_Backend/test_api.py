import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Setup client exactly as in ai_service.py
base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
api_key = os.getenv("OPENAI_API_KEY")

print(f"Testing OpenRouter API...")
print(f"Base URL: {base_url}")
print(f"API Key (first 20 chars): {api_key[:20]}...")
print(f"API Key length: {len(api_key)}")
print()

# OpenRouter headers
default_headers = {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Astrarium",
}

client = OpenAI(
    api_key=api_key,
    base_url=base_url,
    default_headers=default_headers
)

try:
    print("Attempting to generate a simple test question with FREE model...")
    print("Using model: meta-llama/llama-3.2-3b-instruct:free")
    response = client.chat.completions.create(
        model="meta-llama/llama-3.2-3b-instruct:free",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Generate a simple multiple choice question about Python."
            },
            {
                "role": "user",
                "content": "Create a simple Python question with 4 options in JSON format."
            }
        ],
        temperature=0.7,
        max_tokens=300
    )

    print("[SUCCESS] API is working with FREE model!")
    print()
    print("Response:")
    print(response.choices[0].message.content)
    print()
    print("Model used:", response.model)
    print("Tokens used:", response.usage.total_tokens if hasattr(response, 'usage') else 'N/A')

except Exception as e:
    print(f"[ERROR] {type(e).__name__}")
    print(f"Message: {str(e)}")
    print()

    # Check specific error types
    if "401" in str(e):
        print("This is an authentication error. Possible causes:")
        print("1. API key is invalid or expired")
        print("2. API key doesn't have credits (OpenRouter requires prepaid credits)")
        print("3. API key is for a different service")
        print()
        print("To fix:")
        print("- Go to https://openrouter.ai/keys")
        print("- Generate a new API key")
        print("- Check your credits at https://openrouter.ai/credits")
    elif "429" in str(e):
        print("Rate limit exceeded. Wait a moment and try again.")
    elif "500" in str(e) or "503" in str(e):
        print("OpenRouter server error. Try again in a moment.")
