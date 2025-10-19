import os
import json
import random
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
from typing import Dict, List

# ------------------------------
# Load environment variables first
# ------------------------------
load_dotenv()

BASE_URL = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
API_KEY = os.getenv("OPENAI_API_KEY")

print(f"[CelestialAIOracle] Testing API connection...")
print(f"Base URL: {BASE_URL}")
print(f"API Key (first 20 chars): {API_KEY[:20]}...")
print(f"API Key length: {len(API_KEY)}\n")

# ------------------------------
# OpenRouter requires extra headers
# ------------------------------
default_headers = {}
if "openrouter" in BASE_URL.lower():
    default_headers = {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Astrarium",
    }

# ------------------------------
# Initialize OpenAI client
# ------------------------------
client = OpenAI(
    api_key=API_KEY,
    base_url=BASE_URL,
    default_headers=default_headers
)

# ------------------------------
# Helper function to extract JSON from markdown
# ------------------------------
def extract_json_from_markdown(content: str) -> dict:
    """Extract JSON from response, handling ```json or ``` blocks"""
    try:
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        print(f"[WARNING] Failed to parse JSON from AI response: {e}")
        return {}

# ------------------------------
# CelestialAIOracle class
# ------------------------------
class CelestialAIOracle:
    """AI system for retention-focused skill questions and evaluation"""

    @staticmethod
    def generate_skill_question(
        skill_name: str,
        category: str = None,
        proficiency_level: float = 5.0,
        question_type: str = "random"
    ) -> Dict:

        # Determine difficulty
        if proficiency_level < 3:
            difficulty = "easy"
        elif proficiency_level < 7:
            difficulty = "medium"
        else:
            difficulty = "hard"

        difficulty_themes = {
            "easy": "stargazer level - fundamental concepts",
            "medium": "nebula navigator level - practical application",
            "hard": "cosmic architect level - advanced mastery"
        }

        category_context = f" ({category})" if category else ""

        # Force all questions to be multiple choice
        actual_type = "multiple_choice"

        prompt = f"""
You are the Celestial Oracle, guardian against the forgetting curve.

Generate a {difficulty_themes[difficulty]} question about "{skill_name}"{category_context} to help reinforce knowledge the user may be forgetting.

Question Type: MULTIPLE CHOICE (4 options)

Return ONLY valid JSON in the appropriate format with this structure:
{{
    "question": "Your question text here",
    "type": "multiple_choice",
    "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
    }},
    "correct_answer": "A" (or B, C, D),
    "explanation": "Brief explanation"
}}
"""

        try:
            # Use gpt-4o-mini for better reliability
            model_name = "openai/gpt-4o-mini" if "openrouter" in BASE_URL.lower() else "gpt-4o-mini"

            # DEBUG: show AI call info
            print(f"[DEBUG] Sending request to AI model {model_name}...")
            print(f"[DEBUG] Prompt:\n{prompt}")

            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are a cosmic skill retention expert. Generate questions that reinforce previously learned skills."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=600
            )

            content = response.choices[0].message.content.strip()
            print(f"[DEBUG] Raw AI response (first 200 chars): {content[:200]}...")
            print(f"[DEBUG] Full AI response: {content}")
            question_data = extract_json_from_markdown(content)

            # DEBUG: show extracted JSON
            print(f"[DEBUG] Extracted JSON: {question_data}")

            # Validate that we got required fields
            if not question_data or "question" not in question_data:
                raise ValueError(f"AI returned invalid/empty JSON. Response was: {content[:500]}")

            # Handle multiple-choice
            if question_data.get("type") == "multiple_choice":
                options_list = [question_data["options"].get(k) for k in sorted(question_data["options"].keys())]
                return {
                    "question": question_data["question"],
                    "type": "multiple_choice",
                    "options": options_list,
                    "correct_answer": question_data["options"][question_data["correct_answer"]],
                    "explanation": question_data.get("explanation"),
                    "difficulty": difficulty,
                    "cosmic_reward": 10 if difficulty=="easy" else 15 if difficulty=="medium" else 20
                }
            else:  # open-ended
                return {
                    "question": question_data["question"],
                    "type": "open_ended",
                    "options": None,
                    "correct_answer": question_data["correct_answer"],
                    "acceptable_answers": question_data.get("acceptable_answers", []),
                    "explanation": question_data.get("explanation"),
                    "difficulty": difficulty,
                    "cosmic_reward": 15 if difficulty=="easy" else 20 if difficulty=="medium" else 25
                }

        except Exception as e:
            print(f"[WARNING] Cosmic disturbance in AI generation: {e}")
            return {
                "question": f"In the vast cosmos of {skill_name}, which principle guides your path?",
                "type": "multiple_choice",
                "options": [
                    "Following best practices and documentation",
                    "Trial and error experimentation",
                    "Copying solutions without understanding",
                    "Avoiding the tool entirely"
                ],
                "correct_answer": "Following best practices and documentation",
                "explanation": "Fallback cosmic question. Check your API key in the .env file!",
                "difficulty": "easy",
                "cosmic_reward": 10
            }

    @staticmethod
    def evaluate_open_ended_answer(question_text: str, user_answer: str, correct_answer: str, acceptable_answers: List[str] = None) -> Dict:
        """Evaluate open-ended answers using AI semantic similarity"""
        user_lower = user_answer.strip().lower()
        correct_lower = correct_answer.strip().lower()

        if acceptable_answers:
            for ans in acceptable_answers:
                if ans.lower() in user_lower or user_lower in ans.lower():
                    return {"is_correct": True, "feedback": "Correct!", "confidence": 1.0}

        try:
            prompt = f"""
Evaluate if the user's answer is correct.

Question: {question_text}
Correct Answer: {correct_answer}
User's Answer: {user_answer}

Respond with ONLY JSON: {{"is_correct": true or false, "reasoning": "Brief explanation", "confidence": 0.0-1.0}}
"""
            # Use gpt-4o-mini for better reliability
            model_name = "openai/gpt-4o-mini" if "openrouter" in BASE_URL.lower() else "gpt-4o-mini"

            print(f"[DEBUG] Sending evaluation request to AI model {model_name}...")
            print(f"[DEBUG] Prompt:\n{prompt}")

            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are an expert evaluator of answers."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=200
            )

            content = response.choices[0].message.content.strip()
            print(f"[DEBUG] Raw evaluation response: {content[:200]}...")
            result = extract_json_from_markdown(content)
            return {
                "is_correct": result.get("is_correct", False),
                "feedback": result.get("reasoning", "Unable to evaluate"),
                "confidence": result.get("confidence", 0.5)
            }

        except Exception as e:
            similarity = user_lower in correct_lower or correct_lower in user_lower
            return {
                "is_correct": similarity,
                "feedback": "Fallback evaluation" if similarity else "Answer doesn't match",
                "confidence": 0.6 if similarity else 0.3
            }

    @staticmethod
    def generate_hint(question_text: str, correct_answer: str, options: Dict) -> str:
        """Generate subtle cosmic hint"""
        try:
            prompt = f"""
Provide a cryptic but helpful hint for this question:

Question: {question_text}
Options: {json.dumps(options)}
Correct Answer: {correct_answer}

Keep it mystical and helpful. Max 2 sentences.
"""
            # Use gpt-4o-mini for better reliability
            model_name = "openai/gpt-4o-mini" if "openrouter" in BASE_URL.lower() else "gpt-4o-mini"

            print(f"[DEBUG] Sending hint request to AI model {model_name}...")
            print(f"[DEBUG] Prompt:\n{prompt}")

            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are a mystical guide offering cosmic wisdom."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=100
            )

            content = response.choices[0].message.content.strip()
            print(f"[DEBUG] Raw hint response: {content[:200]}...")
            return content

        except Exception:
            return "* The stars whisper: Look at fundamentals and trust your instincts."

    @staticmethod
    def analyze_skill_decay(skill_data: Dict) -> Dict:
        """Estimate skill decay and suggest practice intensity"""
        last_practiced = skill_data.get("last_practiced")
        health_score = skill_data.get("health_score", 100)

        if not last_practiced:
            days_idle = 999
        else:
            if isinstance(last_practiced, str):
                last_practiced = datetime.fromisoformat(last_practiced.replace('Z', '+00:00'))
            days_idle = (datetime.utcnow() - last_practiced).days

        if days_idle >= 180:
            urgency, msg, questions = "critical", "!! CRITICAL DECAY: Practice immediately!", 10
        elif days_idle >= 90:
            urgency, msg, questions = "high", "! HIGH DECAY: Significant knowledge loss.", 5
        elif days_idle >= 30:
            urgency, msg, questions = "medium", "~ MODERATE DECAY: Refresh concepts.", 3
        elif days_idle >= 7:
            urgency, msg, questions = "low", "- EARLY DECAY: Quick refresher recommended.", 2
        else:
            urgency, msg, questions = "maintenance", "* WELL MAINTAINED: Keep practicing.", 1

        return {
            "urgency": urgency,
            "days_idle": days_idle,
            "health_score": health_score,
            "message": msg,
            "questions_recommended": questions,
            "cosmic_status": "eclipsed" if health_score < 40 else "stable" if health_score < 80 else "radiant"
        }
