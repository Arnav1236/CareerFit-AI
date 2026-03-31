import pdfplumber
from typing import Optional

def extract_text_from_pdf(pdf_file) -> str:
    """
    Extract text from PDF file
    
    Args:
        pdf_file: File object from FastAPI upload
    
    Returns:
        Extracted text as string
    """
    try:
        text_content = []
        
        with pdfplumber.open(pdf_file.file) as pdf:
            for page in pdf.pages:
                # Extract text from each page
                page_text = page.extract_text()
                if page_text:
                    text_content.append(page_text)
        
        # Join all pages with newlines
        full_text = "\n\n".join(text_content)
        
        # Basic cleaning
        full_text = full_text.strip()
        
        if not full_text:
            raise ValueError("PDF appears to be empty or text could not be extracted")
        
        return full_text
        
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")

def clean_text(text: str) -> str:
    """
    Clean extracted text by removing excessive whitespace
    
    Args:
        text: Raw extracted text
    
    Returns:
        Cleaned text
    """
    # Remove multiple spaces
    text = " ".join(text.split())
    
    # Remove multiple newlines (keep paragraph structure)
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    text = "\n".join(lines)
    
    return text