import os
import json
import re
from typing import List
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from models import Skill, Company, Role
from schemas import AnalysisResult, UnmatchedSkillOut, ExperienceItem, EducationItem

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# ── Initialize Groq client (OpenAI-compatible) ─────────────────────────────────
_groq_client = None

if GROQ_API_KEY:
    from openai import OpenAI
    _groq_client = OpenAI(
        api_key=GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
    )
    print("✅ Using Groq API (meta-llama/llama-4-scout-17b-16e-instruct)")
else:
    print("⚠️  No GROQ_API_KEY found — using rule-based analyzer")


# ── DB helpers ─────────────────────────────────────────────────────────────────

def get_role_skills(db: Session, role_title: str, company_names: List[str]) -> dict:
    """Fetch required skills for the given role and companies from the database."""
    role = db.query(Role).filter(Role.title.ilike(f"%{role_title}%")).first()
    if not role:
        all_roles = db.query(Role).all()
        role = all_roles[0] if all_roles else None

    role_skills = []
    if role:
        skills = db.query(Skill).filter(Skill.role_id == role.id).all()
        role_skills = [
            {
                "name": s.name,
                "importance": s.importance,
                "category": s.category,
                "course_title": s.course_title,
                "course_provider": s.course_provider,
                "course_url": s.course_url,
                "course_price": s.course_price,
            }
            for s in skills
        ]

    company_skills = []
    for company_name in company_names:
        company = db.query(Company).filter(Company.name.ilike(f"%{company_name}%")).first()
        if company:
            c_skills = db.query(Skill).filter(Skill.company_id == company.id).all()
            for s in c_skills:
                company_skills.append({
                    "name": s.name,
                    "importance": s.importance,
                    "category": s.category,
                    "company": company_name,
                    "course_title": s.course_title,
                    "course_provider": s.course_provider,
                    "course_url": s.course_url,
                    "course_price": s.course_price,
                })

    return {
        "role_title": role.title if role else role_title,
        "role_skills": role_skills,
        "company_skills": company_skills,
    }


# ── Prompt builder ─────────────────────────────────────────────────────────────

def build_analysis_prompt(resume_text: str, role_title: str, companies: List[str], skills_data: dict) -> str:
    company_str = ", ".join(companies) if companies else "General Tech Companies"
    role_skills_json = json.dumps(skills_data["role_skills"], indent=2)
    company_skills_json = json.dumps(skills_data["company_skills"], indent=2)

    return f"""You are an expert technical recruiter and career coach. Analyze the following resume against the requirements for a **{role_title}** position at **{company_str}**.

## Resume Text:
{resume_text}

## Required Skills for {role_title}:
{role_skills_json}

## Company-Specific Skills for {company_str}:
{company_skills_json}

## Your Task:
1. Identify which required skills the candidate has (matched) vs. is missing (gaps).
2. Extract real work experience and education from the resume.
3. Identify top strengths and areas to improve.
4. Calculate an overall readiness score (0-100).

## Response Format:
Respond with ONLY valid JSON — no markdown, no extra text:

{{
  "score": <integer 0-100>,
  "summary": "<2-3 sentences about the candidate's profile and fit>",
  "matched_skills": ["skill1", "skill2"],
  "unmatched_skills": [
    {{
      "skill": "skill name",
      "importance": "Critical|High|Medium",
      "category": "category",
      "course": {{
        "title": "Course title",
        "provider": "Udemy|Coursera|Educative|YouTube",
        "url": "https://...",
        "price": "$X or Free"
      }}
    }}
  ],
  "experience": [
    {{"role": "Job Title", "company": "Company", "duration": "X years", "year": "YYYY"}}
  ],
  "education": [
    {{"degree": "Degree", "institution": "University", "year": "YYYY", "score": "X.X GPA"}}
  ],
  "top_strengths": ["strength1", "strength2", "strength3", "strength4"],
  "improvements": ["improvement1", "improvement2", "improvement3", "improvement4"]
}}

Rules:
- matched_skills: Only skills the candidate CLEARLY has.
- unmatched_skills: Only skills from the required list NOT in the resume.
- score: 50-65 = average, 70-80 = good, 85+ = excellent.
- Return ONLY the JSON object."""


# ── Response parser ────────────────────────────────────────────────────────────

def parse_ai_response(response_text: str, skills_data: dict) -> dict:
    cleaned = re.sub(r'```(?:json)?\s*', '', response_text).strip()
    cleaned = re.sub(r'```\s*$', '', cleaned).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    return _rule_based_fallback(resume_text="", skills_data=skills_data)


# ── Rule-based fallback ────────────────────────────────────────────────────────

def _rule_based_fallback(resume_text: str, skills_data: dict) -> dict:
    """
    Smart keyword-based skill matcher — no AI needed.
    Works entirely offline from the database skills list.
    """
    text_lower = resume_text.lower()

    all_skills = skills_data["role_skills"] + skills_data["company_skills"]
    seen = set()
    unique_skills = []
    for s in all_skills:
        if s["name"].lower() not in seen:
            seen.add(s["name"].lower())
            unique_skills.append(s)

    matched = []
    unmatched = []

    for skill in unique_skills:
        skill_name = skill["name"]
        variants = [
            skill_name.lower(),
            skill_name.lower().replace(".", "").replace(" ", ""),
            skill_name.lower().split(".")[0],
            skill_name.lower().replace("(", "").replace(")", ""),
        ]
        found = any(v in text_lower for v in variants if len(v) > 1)

        if found:
            matched.append(skill_name)
        else:
            course = {
                "title": skill.get("course_title") or f"Learn {skill_name}",
                "provider": skill.get("course_provider") or "Udemy",
                "url": skill.get("course_url") or "https://udemy.com",
                "price": skill.get("course_price") or "Check site",
            }
            unmatched.append({
                "skill": skill_name,
                "importance": skill.get("importance", "Medium"),
                "category": skill.get("category", "General"),
                "course": course,
            })

    importance_weights = {"Critical": 3, "High": 2, "Medium": 1, "Nice-to-have": 0.5}
    total_weight = sum(importance_weights.get(s.get("importance", "Medium"), 1) for s in unique_skills)
    matched_weight = sum(
        importance_weights.get(s.get("importance", "Medium"), 1)
        for s in unique_skills if s["name"] in matched
    )
    score = int((matched_weight / total_weight * 70) + 30) if total_weight > 0 else 50
    score = min(95, max(35, score))

    experience = []
    exp_pattern = re.findall(
        r'([A-Z][a-zA-Z\s]+(?:developer|engineer|analyst|manager|designer|intern|lead|architect))'
        r'.{0,50}?([A-Z][a-zA-Z\s&.,]+(?:inc|ltd|corp|llc|tech|solutions|systems)?)',
        resume_text, re.IGNORECASE
    )
    for i, (role_match, company_match) in enumerate(exp_pattern[:3]):
        experience.append({
            "role": role_match.strip()[:60],
            "company": company_match.strip()[:50],
            "duration": "N/A",
            "year": "N/A",
        })

    education = []
    edu_pattern = re.findall(
        r'(B\.?Tech|B\.?E|B\.?Sc|M\.?Tech|M\.?Sc|MBA|Ph\.?D|Bachelor|Master|B\.?S|M\.?S)'
        r'.{0,80}?([A-Z][a-zA-Z\s]+(?:University|College|Institute|IIT|NIT|BITS|MIT|Stanford)?)',
        resume_text, re.IGNORECASE
    )
    for deg, inst in edu_pattern[:2]:
        education.append({
            "degree": deg.strip(),
            "institution": inst.strip()[:60],
            "year": "N/A",
            "score": "N/A",
        })

    role_title = skills_data.get("role_title", "the role")
    match_pct = int(len(matched) / len(unique_skills) * 100) if unique_skills else 0

    summary = (
        f"Based on skill analysis, you match {len(matched)} out of {len(unique_skills)} "
        f"required skills for {role_title} ({match_pct}% match rate). "
    )
    if score >= 75:
        summary += "You have a strong foundation — focus on the remaining gaps to stand out."
    elif score >= 55:
        summary += "You have a decent base, but several key skills need development to be competitive."
    else:
        summary += "There are significant skill gaps to address before targeting senior roles at top companies."

    strengths = [f"Proficiency in {s}" for s in matched[:4]] or ["Technical foundation present"]
    improvements = [f"Learn {s['skill']} ({s['importance']} priority)" for s in unmatched[:4]] or ["Continue building skills"]

    return {
        "score": score,
        "summary": summary,
        "matched_skills": matched,
        "unmatched_skills": unmatched,
        "experience": experience,
        "education": education,
        "top_strengths": strengths,
        "improvements": improvements,
    }


# ── Skill enricher ─────────────────────────────────────────────────────────────

def enrich_unmatched_skills(unmatched: list, skills_data: dict) -> list:
    db_skills_map = {s["name"].lower(): s for s in skills_data["role_skills"]}
    db_skills_map.update({s["name"].lower(): s for s in skills_data["company_skills"]})

    enriched = []
    for item in unmatched:
        skill_name = item.get("skill", "")
        db_entry = db_skills_map.get(skill_name.lower())

        course = item.get("course") or {}
        if db_entry and not course.get("title"):
            course = {
                "title": db_entry.get("course_title", ""),
                "provider": db_entry.get("course_provider", ""),
                "url": db_entry.get("course_url", ""),
                "price": db_entry.get("course_price", ""),
            }

        enriched.append({
            "skill": skill_name,
            "importance": item.get("importance", "Medium"),
            "category": item.get("category") or (db_entry.get("category") if db_entry else "General"),
            "course": course,
        })

    return enriched


# ── Main analysis entry point ──────────────────────────────────────────────────

async def analyze_resume(
    db: Session,
    resume_text: str,
    role_title: str,
    companies: List[str],
    resume_preview: str,
) -> AnalysisResult:
    """
    Priority:
    1. Groq API (if GROQ_API_KEY set) — llama-4-scout-17b-16e-instruct (free tier)
    2. Rule-based keyword matcher — works offline, no API needed
    """
    skills_data = get_role_skills(db, role_title, companies)

    parsed = None

    # ── Groq ───────────────────────────────────────────────────────────────────
    if _groq_client:
        try:
            prompt = build_analysis_prompt(resume_text, role_title, companies, skills_data)
            response = _groq_client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert technical recruiter. Always respond with valid JSON only, no markdown."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=4096,
            )
            parsed = parse_ai_response(response.choices[0].message.content, skills_data)
        except Exception as e:
            print(f"⚠️  Groq failed ({e}), falling back to rule-based")
            parsed = None

    # ── Rule-based fallback ───────────────────────────────────────────────────
    if parsed is None:
        parsed = _rule_based_fallback(resume_text, skills_data)

    enriched_unmatched = enrich_unmatched_skills(parsed.get("unmatched_skills", []), skills_data)

    return AnalysisResult(
        score=parsed.get("score", 0),
        summary=parsed.get("summary", ""),
        matched_skills=parsed.get("matched_skills", []),
        unmatched_skills=[UnmatchedSkillOut(**s) for s in enriched_unmatched],
        experience=[ExperienceItem(**e) for e in parsed.get("experience", [])],
        education=[EducationItem(**edu) for edu in parsed.get("education", [])],
        top_strengths=parsed.get("top_strengths", []),
        improvements=parsed.get("improvements", []),
        role=role_title,
        companies=companies,
        resume_text_preview=resume_preview,
    )