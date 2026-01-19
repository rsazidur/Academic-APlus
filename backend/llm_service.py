import os
import google.generativeai as genai
import json

def generate_with_gemini(context: str, course: str, chapter: str, exam_type: str, difficulty: str):
    """
    Generates a question using Gemini based on context (uploaded text + search results).
    Returns a list of QAItem dictionaries.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("WARNING: GEMINI_API_KEY not found. Returning mock data.")
        return MockGenerator.generate(course, chapter, exam_type, difficulty)
    
    genai.configure(api_key=api_key)

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        You are an expert academic question generator.
        Context:
        {context[:10000]} # Limit context size
        
        Task:
        Generate 1 unique, high-quality {difficulty} difficulty practice question for a {exam_type} exam on the topic: {course} - {chapter}.
        
        Output Format:
        Return ONLY a raw JSON object (no markdown formatting) with the following structure:
        {{
            "question": "The question text here...",
            "marks": 10,
            "difficulty": "{difficulty}",
            "solution": "Detailed step-by-step solution...",
            "common_mistakes": ["Mistake 1", "Mistake 2"]
        }}
        """
        
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        
        data = json.loads(text)
        # Ensure it's a list for consistency with frontend expectation, or return single item
        return [data] 
        
    except Exception as e:
        print(f"Gemini generation error: {e}")
        return MockGenerator.generate(course, chapter, exam_type, difficulty, error=str(e))

class MockGenerator:
    @staticmethod
    def generate(course, chapter, exam_type, difficulty, error=None):
        msg = "(AI Unavailable - using Mock)"
        if error:
            msg += f" Error: {error}"
            
        return [{
            "question": f"{msg} What is the definition of {chapter} in {course}?",
            "marks": 5,
            "difficulty": difficulty,
            "solution": "This is a placeholder solution because the AI service could not be reached.",
            "common_mistakes": ["Assuming AI is always online"]
        }]
