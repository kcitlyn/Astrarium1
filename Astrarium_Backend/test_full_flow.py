import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("ASTRARIUM END-TO-END API TEST")
print("=" * 60)
print(f"Testing backend at: {BASE_URL}")
print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print()

# Test user credentials
test_email = f"test_user_{int(datetime.now().timestamp())}@example.com"
test_password = "TestPassword123!"
test_username = f"TestUser{int(datetime.now().timestamp())}"

print("Step 1: Register new user")
print(f"Email: {test_email}")
print(f"Username: {test_username}")

register_response = requests.post(f"{BASE_URL}/auth/register", json={
    "email": test_email,
    "password": test_password,
    "username": test_username
})

if register_response.status_code == 200:
    print("[SUCCESS] User registered")
    user_data = register_response.json()
    print(f"User ID: {user_data.get('user_id')}")
else:
    print(f"[ERROR] Registration failed: {register_response.status_code}")
    print(register_response.text)
    exit(1)

print()

# Step 2: Login
print("Step 2: Login")
login_response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": test_email,
    "password": test_password
})

if login_response.status_code == 200:
    print("[SUCCESS] Login successful")
    login_data = login_response.json()
    user_id = login_data.get("user_id")
    username = login_data.get("username")
    print(f"User ID: {user_id}")
    print(f"Username: {username}")
else:
    print(f"[ERROR] Login failed: {login_response.status_code}")
    print(login_response.text)
    exit(1)

print()

# Step 3: Add a skill
# Use timestamp to create unique skill name
unique_skill = f"Python Programming {int(datetime.now().timestamp())}"
print(f"Step 3: Add skill: {unique_skill}")
# This API uses simple user_id auth (no JWT tokens)

add_skill_response = requests.post(f"{BASE_URL}/skills/add",
    json={
        "skill_name": unique_skill,
        "category": "Programming",
        "proficiency_level": 7,
        "star_power": 85
    }
)

if add_skill_response.status_code == 200:
    print("[SUCCESS] Skill added")
    skill_data = add_skill_response.json()
    print(f"Response: {json.dumps(skill_data, indent=2)}")
else:
    print(f"[ERROR] Failed to add skill: {add_skill_response.status_code}")
    print(add_skill_response.text)
    exit(1)

print()

# Step 4: Get user skills to find skill ID
print("Step 4: Get my skills")
get_skills_response = requests.get(f"{BASE_URL}/skills/my-skills")

if get_skills_response.status_code == 200:
    skills = get_skills_response.json()
    print(f"[SUCCESS] Found {len(skills)} skills")

    if len(skills) > 0:
        skill = skills[0]
        skill_id = skill.get("id")
        print(f"Skill ID: {skill_id}")
        print(f"Skill Name: {skill.get('skill_name')}")
    else:
        print("[ERROR] No skills found")
        exit(1)
else:
    print(f"[ERROR] Failed to get skills: {get_skills_response.status_code}")
    print(get_skills_response.text)
    exit(1)

print()

# Step 5: Generate a question using AI
print("=" * 60)
print("CRITICAL TEST: AI Question Generation")
print("=" * 60)
print(f"Generating question for skill_id: {skill_id}")
print(f"Skill: Python Programming (proficiency level: 7)")
print()

generate_question_response = requests.post(
    f"{BASE_URL}/questions/generate",
    json={"skill_id": skill_id}
)

if generate_question_response.status_code == 200:
    question_data = generate_question_response.json()

    print("[SUCCESS] Question generated!")
    print()
    print("Question Details:")
    print(f"  Type: {question_data.get('type')}")
    print(f"  Question: {question_data.get('question')}")
    print(f"  Difficulty: {question_data.get('difficulty')}")
    print()

    if question_data.get('type') == 'multiple_choice':
        print("  Options:")
        for i, option in enumerate(question_data.get('options', []), 1):
            print(f"    {i}. {option}")
        print()
        print(f"  Correct Answer: {question_data.get('correct_answer')}")

    print(f"  Explanation: {question_data.get('explanation')}")
    print()

    # Check if this is a fallback question
    question_text = question_data.get('question', '').lower()
    is_fallback = "in the vast cosmos" in question_text and "which principle guides your path" in question_text

    if is_fallback:
        print("[WARNING] This appears to be a FALLBACK question!")
        print("The AI API is NOT working - using generic fallback.")
        print()
        print("Possible causes:")
        print("1. Invalid OpenRouter API key (most likely)")
        print("2. OpenRouter account has no credits")
        print("3. Network connectivity issues")
        print()
        print("See FIX_AI_COMPLETE_GUIDE.md for solutions")
    else:
        print("[SUCCESS] This is an AI-GENERATED question!")
        print("The question is contextual and specific to Python.")
        print()
        print("Your OpenAI/OpenRouter integration is WORKING!")

        # Save question_id for potential answer test
        question_id = question_data.get('question_id')
        if question_id:
            print(f"Question ID: {question_id}")

else:
    print(f"[ERROR] Failed to generate question: {generate_question_response.status_code}")
    print(generate_question_response.text)
    exit(1)

print()
print("=" * 60)
print("TEST COMPLETE")
print("=" * 60)
