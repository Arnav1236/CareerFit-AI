from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from typing import List, Optional


# ── Company Schemas ────────────────────────────────────────────────────────────

class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    size: Optional[str] = None
    headquarters: Optional[str] = None
    description: Optional[str] = None
    culture: Optional[str] = None
    tech_stack: Optional[str] = None
    glassdoor_rating: Optional[float] = None
    website: Optional[str] = None
    logo_color: Optional[str] = None

class CompanyOut(CompanyBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ── Role Schemas ───────────────────────────────────────────────────────────────

class RoleOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    level: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# ── Skill Schemas ──────────────────────────────────────────────────────────────

class SkillOut(BaseModel):
    id: int
    name: str
    category: Optional[str] = None
    importance: Optional[str] = None
    course_title: Optional[str] = None
    course_provider: Optional[str] = None
    course_url: Optional[str] = None
    course_price: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# ── Interview Question Schemas ─────────────────────────────────────────────────

class QuestionOut(BaseModel):
    id: int
    question: str
    answer: Optional[str] = None
    difficulty: Optional[str] = None
    category: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# ── Analysis Schemas ───────────────────────────────────────────────────────────

class UnmatchedSkillOut(BaseModel):
    skill: str
    importance: str
    category: Optional[str] = None
    course: Optional[dict] = None

class ExperienceItem(BaseModel):
    role: str
    company: str
    duration: str
    year: str

class EducationItem(BaseModel):
    degree: str
    institution: str
    year: str
    score: str

class AnalysisResult(BaseModel):
    """
    The API serializes field names to camelCase so the React frontend
    can use result.matchedSkills, result.unmatchedSkills, result.topStrengths etc.
    """
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    score: int
    summary: str
    matched_skills: List[str]
    unmatched_skills: List[UnmatchedSkillOut]
    experience: List[ExperienceItem]
    education: List[EducationItem]
    top_strengths: List[str]
    improvements: List[str]
    role: str
    companies: List[str]
    resume_text_preview: str
