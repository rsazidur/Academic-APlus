from typing import List
from app.models import GenerateRequest, GenerateResponse, QAItem


class QuestionService:
    """Service for generating exam questions"""
    
    @staticmethod
    def generate_questions(request: GenerateRequest) -> GenerateResponse:
        """
        Generate questions based on course, chapter, and difficulty.
        
        Args:
            request: GenerateRequest containing course info and preferences
            
        Returns:
            GenerateResponse with generated questions
        """
        items = QuestionService._create_questions_by_difficulty(
            request.difficulty,
            request.course,
            request.chapter,
            request.examType
        )
        
        return GenerateResponse(
            course=request.course,
            chapter=request.chapter,
            examType=request.examType,
            items=items
        )
    
    @staticmethod
    def _create_questions_by_difficulty(
        difficulty: str,
        course: str,
        chapter: str,
        exam_type: str
    ) -> List[QAItem]:
        """Create questions based on difficulty level"""
        
        if difficulty == "easy":
            return [
                QAItem(
                    question=f"Define key terms from {chapter} in {course}. Give examples.",
                    marks=5,
                    difficulty="easy",
                    solution="Write definitions clearly, then add one example per term.",
                    common_mistakes=["Giving vague definitions", "No example"]
                ),
                QAItem(
                    question=f"List the main concepts covered in {chapter}.",
                    marks=3,
                    difficulty="easy",
                    solution="Provide a bulleted list of key concepts with brief descriptions.",
                    common_mistakes=["Missing important concepts", "Too brief explanations"]
                )
            ]
        
        elif difficulty == "medium":
            return [
                QAItem(
                    question=f"Solve a typical {chapter} problem that is common in {exam_type} exams.",
                    marks=10,
                    difficulty="medium",
                    solution="Step 1: Identify given values.\nStep 2: Apply the main rule.\nStep 3: Show final answer.",
                    common_mistakes=["Skipping steps", "Wrong formula/rule"]
                ),
                QAItem(
                    question=f"Explain the relationship between different concepts in {chapter}.",
                    marks=8,
                    difficulty="medium",
                    solution="Describe each concept, then show how they connect with examples.",
                    common_mistakes=["Not showing connections", "Incomplete explanations"]
                )
            ]
        
        else:  # hard
            return [
                QAItem(
                    question=f"Create a challenging exam-style problem from {chapter} ({course}) and solve it.",
                    marks=10,
                    difficulty="hard",
                    solution="Use multi-step reasoning, show intermediate steps, then final result.",
                    common_mistakes=["Assuming missing info", "Not justifying steps"]
                ),
                QAItem(
                    question=f"Analyze a complex scenario involving {chapter} concepts and provide a detailed solution.",
                    marks=15,
                    difficulty="hard",
                    solution="Break down the scenario, apply relevant theories, show all work, and justify your approach.",
                    common_mistakes=["Not explaining reasoning", "Missing edge cases", "Incorrect assumptions"]
                )
            ]
