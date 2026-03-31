from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import requests
import json
from pdf_parser import extract_text_from_pdf, clean_text

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file!")

# Initialize FastAPI app
app = FastAPI(
    title="CareerFit AI - Resume Analyzer",
    description="AI-powered resume skill gap analyzer",
    version="1.0.0"
)

# Add CORS middleware (allows frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # In production, specify your frontend URL
    # allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
)

# Pydantic models for request validation
class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str = "Entry Level Software Engineer at a Service-Based Company (TCS/Infosys/Wipro)"
    target_companies: str = ""

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "CareerFit AI Backend is Running!",
        "status": "active",
        "docs": "Visit /docs for interactive API documentation"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "gemini_configured": bool(GEMINI_API_KEY)}

# Function to call Gemini API via REST
def call_gemini_api(system_instruction: str, user_prompt: str):
    """Call Gemini API using direct HTTP request - THIS WORKED FOR YOU"""
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_instruction},
                    {"text": user_prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 4096,
        }
    }
    
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    
    if response.status_code != 200:
        raise Exception(f"Gemini API Error: {response.status_code} - {response.text}")
    
    result = response.json()
    
    # Extract text from response
    if "candidates" in result and len(result["candidates"]) > 0:
        # Check if response was truncated
        candidate = result["candidates"][0]
        
        # Get finish reason
        finish_reason = candidate.get("finishReason", "")
        
        if finish_reason == "MAX_TOKENS":
            raise Exception("Response was truncated. Please try with a shorter resume or simpler job description.")
        
        text = candidate["content"]["parts"][0]["text"]
        return text
    else:
        raise Exception("No response from Gemini API")

# Main analysis endpoint
@app.post("/analyze-resume")
async def analyze_resume(request: ResumeAnalysisRequest):
    try:
        # Create the system prompt
        system_instruction = """You are an expert career counselor and technical interviewer. Analyze the resume vs job requirements.

Respond ONLY in valid JSON format. You MUST use exactly these keys and data types (no markdown, no extra text):
{
    "matchScore": 85,
    "matchedSkills": ["skill1", "skill2"],
    "missingSkills": ["skill3", "skill4"],
    "chartData": [
        {"subject": "Frontend/UI", "A": 80, "fullMark": 100},
        {"subject": "Backend", "A": 40, "fullMark": 100},
        {"subject": "Architecture", "A": 50, "fullMark": 100},
        {"subject": "DevOps", "A": 20, "fullMark": 100},
        {"subject": "Problem Solving", "A": 90, "fullMark": 100}
    ],
    "roadmap": [
        {
            "week": "Week 1",
            "focus": "Topic to learn",
            "resource": "Name of course/platform",
            "link": "https://www.google.com/search?q=...",
            "type": "Course or Documentation"
        }
    ],
    "interviewQuestions": [
        "Technical interview question 1 based on their gaps?",
        "Scenario based question 2?"
    ]
}

Ensure the chartData subjects adapt to the specific tech stack. Keep roadmap to 3-4 weeks. Be concise."""

        # Create the user prompt
        user_prompt = f"""
RESUME TEXT:
{request.resume_text}

JOB REQUIREMENTS:
{request.job_description}

TARGET COMPANIES (if specified):
{request.target_companies if request.target_companies else "Not specified - analyze for general fit"}

Analyze this resume and provide the JSON output as specified."""

        # Call Gemini API (using the working REST method)
        result_text = call_gemini_api(system_instruction, user_prompt)
        
        # Remove markdown code blocks if present
        result_text = result_text.strip()
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
        result_text = result_text.strip()
        
        # Parse JSON
        try:
            analysis_result = json.loads(result_text)
        except json.JSONDecodeError as e:
            # If JSON parsing fails, return the raw text for debugging
            return {
                "error": "AI returned invalid JSON",
                "raw_response": result_text,
                "parse_error": str(e)
            }
        
        return {
            "success": True,
            "analysis": analysis_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Test endpoint with hardcoded example
@app.get("/test-analysis")
async def test_analysis():
    """Quick test endpoint with sample data"""
    sample_resume = """
    John Doe
    Software Developer
    
    Skills: Python, HTML, CSS, JavaScript, MySQL
    
    Experience:
    - Built a personal portfolio website using HTML/CSS/JS
    - Created a library management system using Python and MySQL
    - Worked on college project for attendance tracking
    
    Education:
    B.Tech in Computer Science (2024)
    """
    
    sample_jd = """
    Job Title: Software Engineer
    Company: TCS
    
    Required Skills:
    - Strong programming skills in Java or Python
    - Knowledge of Data Structures and Algorithms
    - Experience with SQL databases
    - Understanding of Software Development Life Cycle (SDLC)
    - Good communication and teamwork skills
    
    Preferred:
    - Knowledge of React or Angular
    - Experience with Git version control
    """
    
    request = ResumeAnalysisRequest(
        resume_text=sample_resume,
        job_description=sample_jd,
        target_companies="TCS"
    )
    
    return await analyze_resume(request)

# NEW: PDF Upload endpoint
@app.post("/analyze-resume-pdf")
async def analyze_resume_pdf(
    resume_pdf: UploadFile = File(...),
    job_description: str = Form("Entry Level Software Engineer at a Service-Based Company"),
    target_companies: str = Form("")
):
    """
    Analyze resume from PDF upload
    
    Args:
        resume_pdf: PDF file of the resume
        job_description: Job requirements (optional)
        target_companies: Target companies (optional)
    """
    
    # Validate file type
    if not resume_pdf.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    try:
        # Extract text from PDF
        resume_text = extract_text_from_pdf(resume_pdf)
        resume_text = clean_text(resume_text)
        
        # Check if text was extracted
        if len(resume_text) < 50:
            raise HTTPException(
                status_code=400, 
                detail="Could not extract sufficient text from PDF. Please ensure the PDF is not scanned/image-based."
            )
        
        # Create request object
        request = ResumeAnalysisRequest(
            resume_text=resume_text,
            job_description=job_description,
            target_companies=target_companies
        )
        
        # Analyze using existing function
        result = await analyze_resume(request)
        
        # Add extracted text to response (for debugging)
        result["extracted_text_preview"] = resume_text[:500] + "..."
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")

# Run with: uvicorn main:app --reload