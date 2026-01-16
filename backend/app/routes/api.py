from fastapi import APIRouter
from app.models import GenerateRequest, GenerateResponse, HealthResponse
from app.services import QuestionService

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        HealthResponse with status and version
    """
    return HealthResponse(status="ok", version="1.0.0")


@router.post("/generate", response_model=GenerateResponse, tags=["Questions"])
def generate_questions(request: GenerateRequest):
    """
    Generate exam questions based on course, chapter, and difficulty.
    
    Args:
        request: GenerateRequest containing:
            - course: Course name (e.g., "CSE 260")
            - chapter: Chapter name (e.g., "Boolean Algebra")
            - examType: Type of exam ("quiz", "mid", "final")
            - difficulty: Question difficulty ("easy", "medium", "hard")
    
    Returns:
        GenerateResponse containing generated questions with solutions
    """
    return QuestionService.generate_questions(request)
