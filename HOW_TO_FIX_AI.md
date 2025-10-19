# 🔑 How to Fix AI Question Generation

## The Problem

The AI question generation is failing with error:
```
Error code: 401 - {'error': {'message': 'User not found.', 'code': 401}}
```

This means your OpenRouter API key is **invalid** or **doesn't exist**.

---

## ✅ Solution: Get a Valid API Key

### Option 1: Use OpenRouter (Current Setup)

1. **Go to OpenRouter**: https://openrouter.ai/
2. **Sign up** or **log in** to your account
3. **Go to API Keys**: https://openrouter.ai/keys
4. **Create a new API key**
5. **Add credits** to your account (OpenRouter requires prepaid credits)
6. **Copy your new API key**

7. **Update the `.env` file** in `Astrarium_Backend`:
   ```env
   DATABASE_URL=sqlite:///./astral_pet.db
   SECRET_KEY=astral-celestial-secret-key-12345
   OPENAI_API_KEY=sk-or-v1-YOUR-NEW-KEY-HERE
   OPENAI_BASE_URL=https://openrouter.ai/api/v1
   ```

8. **Restart the backend server** (Ctrl+C, then run again)

---

### Option 2: Use OpenAI Directly (Simpler)

If you have an OpenAI API key instead:

1. **Get an OpenAI API key**: https://platform.openai.com/api-keys
2. **Update `.env` in `Astrarium_Backend`**:
   ```env
   DATABASE_URL=sqlite:///./astral_pet.db
   SECRET_KEY=astral-celestial-secret-key-12345
   OPENAI_API_KEY=sk-YOUR-OPENAI-KEY-HERE
   OPENAI_BASE_URL=https://api.openai.com/v1
   ```
3. **Restart the backend server**

---

### Option 3: Use Free AI Models (Alternative)

If you don't want to pay for API access, you can modify the code to use free alternatives:

1. **Update `ai_service.py` line 128** to use a free model like `meta-llama/llama-3.2-3b-instruct:free`
2. **Keep OpenRouter as the base URL** (they offer some free models)

---

## 🧪 Testing if AI Works

After updating your API key:

1. **Restart backend**:
   ```bash
   cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Backend
   python -m uvicorn app.main:app --reload --port 8000
   ```

2. **Test in terminal**:
   ```bash
   curl -X POST "http://localhost:8000/questions/generate" \
     -H "Content-Type: application/json" \
     -d "{\"skill_id\":1}"
   ```

3. **If successful**, you should see a generated question in JSON format

4. **If it still fails**, check the backend logs for the specific error

---

## 🚨 Current Issue

Your current API key in `.env`:
```
OPENAI_API_KEY=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
```

This key is giving a "User not found" error, which means:
- The account associated with this key doesn't exist
- The key has been revoked
- The key is invalid

**You MUST get a new API key** for AI to work.

---

## 💡 Temporary Workaround (For Testing Only)

If you just want to test the app without AI, I can modify the code to use fallback questions only (no API calls). This won't be as good but will let you see how the app works.

Would you like me to:
1. Help you set up a proper API key? (Recommended)
2. Create a fallback-only mode for testing? (Temporary)

---

## 📝 Summary

**What you need to do:**
1. Get a valid API key from OpenRouter.ai or OpenAI
2. Replace the `OPENAI_API_KEY` in `Astrarium_Backend/.env`
3. Restart the backend server
4. Try generating questions again

Without a valid API key, the AI question generation will NOT work. The fallback questions are very basic and don't provide the full experience.
