import pdfplumber
import re
import io
from typing import Union


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract and clean text from a PDF file given as bytes.
    Returns cleaned plain text.
    """
    raw_text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text(x_tolerance=3, y_tolerance=3)
            if page_text:
                raw_text += page_text + "\n"

    return clean_text(raw_text)


def clean_text(text: str) -> str:
    """
    Clean extracted resume text:
    - Remove URLs
    - Normalize whitespace
    - Remove repeated special characters
    - Fix common OCR artifacts
    - Preserve meaningful punctuation
    """
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)

    # Remove email addresses (keep domain for context)
    text = re.sub(r'\S+@\S+\.\S+', '[EMAIL]', text)

    # Remove phone numbers variations
    text = re.sub(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]', '[PHONE]', text)

    # Remove excessive special characters / decorators
    text = re.sub(r'[•·▪▸▶►◆★☆✓✔✗✘●○◦⊕⊗]+', '-', text)

    # Remove lines that are just symbols/separators
    text = re.sub(r'^[\-=_\*~#]{3,}$', '', text, flags=re.MULTILINE)

    # Remove repeated whitespace within lines
    text = re.sub(r'[ \t]+', ' ', text)

    # Normalize multiple newlines to max 2
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Strip leading/trailing whitespace per line
    lines = [line.strip() for line in text.split('\n')]

    # Remove very short lines that are likely page numbers / headers
    lines = [line for line in lines if len(line) > 2 or line == '']

    return '\n'.join(lines).strip()


def get_text_preview(text: str, max_chars: int = 500) -> str:
    """Return a short preview of the resume text for the API response."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "..."
