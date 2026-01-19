import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from db import get_db, engine, Base
from models import User, Upload, SiteVisit, QuestionGenerationLog
from auth import hash_password 

# Create tables if not exist
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Auth / User Helper ----------
# Simple secret key for admin actions (in a real app, use env vars)
ADMIN_SECRET_KEY = "key"

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "private_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_guest_user(db: Session = Depends(get_db)) -> User:
    guest = db.query(User).filter(User.email == "guest@example.com").first()
    if not guest:
        # Create a persistent guest user
        guest = User(email="guest@example.com", password_hash="guest_no_login", role="student")
        db.add(guest)
        db.commit()
        db.refresh(guest)
    return guest

def verify_admin_key(x_admin_key: str = Header(None, alias="X-Admin-Key")):
    if x_admin_key != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid or missing Admin Key")

# ---------- Stats / Tracking Route ----------
@app.post("/track-visit")
def track_visit(db: Session = Depends(get_db)):
    # Simple timestamp-based logging
    visit = SiteVisit()
    db.add(visit)
    db.commit()
    return {"ok": True}

@app.get("/admin/stats")
def get_stats(db: Session = Depends(get_db), _ = Depends(verify_admin_key)):
    visits = db.query(SiteVisit).count()
    questions = db.query(QuestionGenerationLog).count()
    return {
        "total_visits": visits,
        "questions_generated": questions
    }

# ---------- Upload routes ----------
@app.post("/uploads/upload")
def upload_file(
    course: str,
    chapter: str,
    visibility: Literal["private","public"] = "private",
    file: UploadFile = File(...),
    user: User = Depends(get_guest_user),
    db: Session = Depends(get_db),
):
    # Basic file type restriction
    allowed = (".pdf", ".docx", ".txt")
    name = file.filename.lower()
    if not name.endswith(allowed):
        raise HTTPException(status_code=400, detail="Only pdf/docx/txt allowed")

    # Save privately (not publicly accessible)
    safe_name = f"user{user.id}_{course}_{chapter}_{file.filename}".replace(" ", "_")
    stored_path = os.path.join(UPLOAD_DIR, safe_name)

    with open(stored_path, "wb") as f:
        f.write(file.file.read())

    rec = Upload(
        owner_id=user.id,
        course=course,
        chapter=chapter,
        visibility=visibility,
        filename=file.filename,
        stored_path=stored_path,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    return {"ok": True, "upload_id": rec.id}

@app.get("/uploads/mine")
def list_my_uploads(user: User = Depends(get_guest_user), db: Session = Depends(get_db)):
    rows = db.query(Upload).filter(Upload.owner_id == user.id).order_by(Upload.created_at.desc()).all()
    return [{"id": r.id, "course": r.course, "chapter": r.chapter, "visibility": r.visibility, "filename": r.filename} for r in rows]

# Admin can upload "official" content
@app.post("/uploads/official")
def upload_official(
    course: str,
    chapter: str,
    file: UploadFile = File(...),
    # This is an admin endpoint, renamed or kept, but with Key protection
    _: bool = Depends(verify_admin_key),
    db: Session = Depends(get_db),
):
    allowed = (".pdf", ".docx", ".txt")
    name = file.filename.lower()
    if not name.endswith(allowed):
        raise HTTPException(status_code=400, detail="Only pdf/docx/txt allowed")

    safe_name = f"official_{course}_{chapter}_{file.filename}".replace(" ", "_")
    stored_path = os.path.join(UPLOAD_DIR, safe_name)

    with open(stored_path, "wb") as f:
        f.write(file.file.read())

    rec = Upload(
        owner_id=1,  # Force ID 1 or the guest ID if admin has one, or default to 1. 2/2: Using 1 is risky if ID 1 doesn't exist.
        # Let's actually use get_guest_user to be safe for foreign key constraints if ID 1 is not guaranteed.
        # Or better: fetch ANY user or the guest user.
        # But wait, Upload requires owner_id. "Admin" uploads might as well be owned by the guest "system account" or similar.
        course=course,
        chapter=chapter,
        visibility="official",
        filename=file.filename,
        stored_path=stored_path,
    )
    # Patch: find *any* user for owner_id or Guest. 
    # Since I don't inject guest user here, I'll allow a hardcoded fallback or optional.
    # To be safe, let's just query guest user inline or use a constant if we know it.
    # I'll rely on the fact that guest user creation in other calls (or startup?) ensures ID exists?
    # No. Let's make it robust.
    guest = db.query(User).filter(User.email == "guest@example.com").first()
    if not guest:
         # Create on the fly if admin uploads before any student visits (unlikely but possible)
         guest = User(email="guest@example.com", password_hash="guest_no_login", role="student")
         db.add(guest)
         db.commit()
         db.refresh(guest)
    rec.owner_id = guest.id
    
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"ok": True, "upload_id": rec.id}

# ---------- Generate route (secure content selection) ----------
ExamType = Literal["quiz","mid","final"]
Difficulty = Literal["easy","medium","hard"]

class GenerateRequest(BaseModel):
    course: str
    chapter: str
    examType: ExamType
    difficulty: Difficulty

class QAItem(BaseModel):
    question: str
    marks: int
    difficulty: Difficulty
    solution: str
    common_mistakes: Optional[List[str]] = None

class GenerateResponse(BaseModel):
    course: str
    chapter: str
    examType: ExamType
    items: List[QAItem]

@app.post("/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest, user: User = Depends(get_guest_user), db: Session = Depends(get_db)):
    # Only use:
    # - user's private/public uploads
    # - official uploads (admin-curated)
    usable = db.query(Upload).filter(
        Upload.course == req.course,
        Upload.chapter == req.chapter
    ).filter(
        (Upload.owner_id == user.id) | (Upload.visibility == "official")
    ).all()

    # For now we just confirm access works:
    if len(usable) == 0:
        pass

    # Dummy output (replace with RAG/LLM later)
    items = [
        QAItem(
            question=f"({req.course} • {req.chapter}) Generate {req.difficulty} practice question for {req.examType}.",
            marks=10 if req.examType != "quiz" else 5,
            difficulty=req.difficulty,
            solution="(Later: real solution from RAG/LLM).",
            common_mistakes=["Skipping steps"]
        )
    ]

    # Log the generation
    log_entry = QuestionGenerationLog(
        course=req.course,
        chapter=req.chapter,
        exam_type=req.examType
    )
    db.add(log_entry)
    db.commit()

    return GenerateResponse(course=req.course, chapter=req.chapter, examType=req.examType, items=items)
