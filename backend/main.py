import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Literal, List, Optional
from sqlalchemy.orm import Session

from db import get_db, engine, Base
from models import User, Upload
from auth import hash_password, verify_password, create_access_token, decode_token

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "private_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ---------- Auth schemas ----------
class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def require_admin(user: User):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

# ---------- Auth routes ----------
@app.post("/auth/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=req.email, password_hash=hash_password(req.password), role="student")
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)

@app.post("/auth/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)

@app.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "role": user.role}

# ---------- Upload routes ----------
@app.post("/uploads/upload")
def upload_file(
    course: str,
    chapter: str,
    visibility: Literal["private","public"] = "private",
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
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
def list_my_uploads(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(Upload).filter(Upload.owner_id == user.id).order_by(Upload.created_at.desc()).all()
    return [{"id": r.id, "course": r.course, "chapter": r.chapter, "visibility": r.visibility, "filename": r.filename} for r in rows]

# Admin can upload "official" content
@app.post("/uploads/official")
def upload_official(
    course: str,
    chapter: str,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_admin(user)

    allowed = (".pdf", ".docx", ".txt")
    name = file.filename.lower()
    if not name.endswith(allowed):
        raise HTTPException(status_code=400, detail="Only pdf/docx/txt allowed")

    safe_name = f"official_{course}_{chapter}_{file.filename}".replace(" ", "_")
    stored_path = os.path.join(UPLOAD_DIR, safe_name)

    with open(stored_path, "wb") as f:
        f.write(file.file.read())

    rec = Upload(
        owner_id=user.id,  # admin user
        course=course,
        chapter=chapter,
        visibility="official",
        filename=file.filename,
        stored_path=stored_path,
    )
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
def generate(req: GenerateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
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
    # Later: you will read these files and run RAG on them.
    if len(usable) == 0:
        # Still allow generation if no files (or block—your choice)
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

    return GenerateResponse(course=req.course, chapter=req.chapter, examType=req.examType, items=items)
