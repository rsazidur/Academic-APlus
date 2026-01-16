from pydantic import BaseModel
from typing import Literal, List, Optional

ExamType = Literal["quiz", "mid", "final"]
Difficulty = Literal["easy", "medium", "hard"]


class GenerateRequest(BaseModel):
    """Request model for generating questions"""
    course: str
    chapter: str
    examType: ExamType
    difficulty: Difficulty

    class Config:
        json_schema_extra = {
            "example": {
                "course": "CSE 260",
                "chapter": "Boolean Algebra",
                "examType": "quiz",
                "difficulty": "medium"
            }
        }


class QAItem(BaseModel):
    """Individual question and answer item"""
    question: str
    marks: int
    difficulty: Difficulty
    solution: str
    common_mistakes: Optional[List[str]] = None


class GenerateResponse(BaseModel):
    """Response model containing generated questions"""
    course: str
    chapter: str
    examType: ExamType
    items: List[QAItem]


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str = "1.0.0"
