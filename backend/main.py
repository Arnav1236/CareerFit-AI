from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from database import engine, get_db
from models import Base, Company, Role, Skill, InterviewQuestion
from schemas import CompanyOut, RoleOut, SkillOut, QuestionOut, AnalysisResult
from pdf_parser import extract_text_from_pdf, get_text_preview
from ai_analyzer import analyze_resume

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Resume Skill Gap Analyzer API",
    description="Backend API for AI-powered resume analysis, skill gap detection, and interview prep.",
    version="1.0.0",
)

# Allow requests from the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ───────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Resume Analyzer API is running 🚀"}


# ── Companies ──────────────────────────────────────────────────────────────────

@app.get("/api/companies", response_model=List[CompanyOut], tags=["Companies"])
def get_companies(db: Session = Depends(get_db)):
    """Return all companies stored in the database."""
    return db.query(Company).order_by(Company.name).all()


@app.get("/api/companies/{company_id}", response_model=CompanyOut, tags=["Companies"])
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


# ── Roles ──────────────────────────────────────────────────────────────────────

@app.get("/api/roles", response_model=List[RoleOut], tags=["Roles"])
def get_roles(db: Session = Depends(get_db)):
    """Return all available roles."""
    return db.query(Role).order_by(Role.title).all()


# ── Skills ─────────────────────────────────────────────────────────────────────

@app.get("/api/skills", response_model=List[SkillOut], tags=["Skills"])
def get_skills(
    role: Optional[str] = Query(None, description="Filter by role title"),
    company: Optional[str] = Query(None, description="Filter by company name"),
    db: Session = Depends(get_db),
):
    """Return skills, optionally filtered by role or company."""
    query = db.query(Skill)
    if role:
        role_obj = db.query(Role).filter(Role.title.ilike(f"%{role}%")).first()
        if role_obj:
            query = query.filter(Skill.role_id == role_obj.id)
    if company:
        company_obj = db.query(Company).filter(Company.name.ilike(f"%{company}%")).first()
        if company_obj:
            query = query.filter(Skill.company_id == company_obj.id)
    return query.all()


# ── Interview Questions ────────────────────────────────────────────────────────

@app.get("/api/questions", response_model=List[QuestionOut], tags=["Interview Questions"])
def get_questions(
    role: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Return interview questions, filtered by role, company, category, or difficulty."""
    query = db.query(InterviewQuestion)

    if role:
        role_obj = db.query(Role).filter(Role.title.ilike(f"%{role}%")).first()
        if role_obj:
            query = query.filter(
                (InterviewQuestion.role_id == role_obj.id) | (InterviewQuestion.role_id == None)
            )

    if company:
        company_obj = db.query(Company).filter(Company.name.ilike(f"%{company}%")).first()
        if company_obj:
            query = query.filter(
                (InterviewQuestion.company_id == company_obj.id) | (InterviewQuestion.company_id == None)
            )

    if category:
        query = query.filter(InterviewQuestion.category.ilike(f"%{category}%"))

    if difficulty:
        query = query.filter(InterviewQuestion.difficulty.ilike(difficulty))

    return query.all()


# ── Resume Analysis ────────────────────────────────────────────────────────────

@app.post("/api/analyze", response_model=AnalysisResult, response_model_by_alias=True, tags=["Analysis"])
async def analyze(
    file: UploadFile = File(..., description="Resume PDF file"),
    role: str = Form(..., description="Target role title"),
    companies: str = Form("", description="Comma-separated list of target company names"),
    db: Session = Depends(get_db),
):
    """
    Main endpoint — accepts a resume PDF, target role, and companies.
    Returns a full AI-powered skill gap analysis.
    """
    # Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Read and size-check the file
    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    # Extract text from PDF
    try:
        resume_text = extract_text_from_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse PDF: {str(e)}")

    if len(resume_text.strip()) < 100:
        raise HTTPException(
            status_code=422,
            detail="Resume text is too short or empty. Please upload a text-based PDF (not a scanned image)."
        )

    # Parse companies list
    company_list = [c.strip() for c in companies.split(",") if c.strip()] if companies else []

    # Get text preview for response
    preview = get_text_preview(resume_text, max_chars=500)

    # Run AI analysis
    try:
        result = await analyze_resume(
            db=db,
            resume_text=resume_text,
            role_title=role,
            companies=company_list,
            resume_preview=preview,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    return result
