"""
PDF Parser Tool - Extract text from tender PDF documents

Uses pdfplumber for better text extraction (handles tables, columns)
with pypdf as fallback.
"""

import io
from typing import Any

import pdfplumber
from pypdf import PdfReader


def parse_pdf(pdf_content: bytes | io.BytesIO) -> dict[str, Any]:
    """
    Parse a PDF document and extract text content.

    Args:
        pdf_content: PDF file as bytes or BytesIO object

    Returns:
        Dict with extracted text, metadata, and page info
    """
    if isinstance(pdf_content, bytes):
        pdf_content = io.BytesIO(pdf_content)

    result = {
        "text": "",
        "pages": [],
        "metadata": {},
        "tables": [],
        "page_count": 0,
        "extraction_method": "pdfplumber",
    }

    try:
        # Try pdfplumber first (better for tables and complex layouts)
        with pdfplumber.open(pdf_content) as pdf:
            result["page_count"] = len(pdf.pages)
            result["metadata"] = pdf.metadata or {}

            all_text = []
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text() or ""
                all_text.append(page_text)

                result["pages"].append({
                    "page_number": i + 1,
                    "text": page_text,
                    "char_count": len(page_text),
                })

                # Extract tables
                tables = page.extract_tables()
                for table in tables:
                    if table:
                        result["tables"].append({
                            "page": i + 1,
                            "data": table,
                        })

            result["text"] = "\n\n".join(all_text)

    except Exception as e:
        # Fallback to pypdf
        result["extraction_method"] = "pypdf_fallback"
        result["extraction_error"] = str(e)

        try:
            pdf_content.seek(0)
            reader = PdfReader(pdf_content)
            result["page_count"] = len(reader.pages)

            if reader.metadata:
                result["metadata"] = {
                    "title": reader.metadata.get("/Title"),
                    "author": reader.metadata.get("/Author"),
                    "subject": reader.metadata.get("/Subject"),
                    "creator": reader.metadata.get("/Creator"),
                }

            all_text = []
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                all_text.append(page_text)

                result["pages"].append({
                    "page_number": i + 1,
                    "text": page_text,
                    "char_count": len(page_text),
                })

            result["text"] = "\n\n".join(all_text)

        except Exception as fallback_error:
            result["error"] = f"Both parsers failed: {e}, {fallback_error}"

    return result


def extract_tender_sections(pdf_text: str) -> dict[str, str]:
    """
    Attempt to identify and extract common tender document sections.

    Args:
        pdf_text: Extracted PDF text

    Returns:
        Dict mapping section names to their content
    """
    sections = {}

    # Common UK tender document section headers
    section_patterns = [
        ("overview", ["overview", "introduction", "background", "summary"]),
        ("scope", ["scope of work", "scope of services", "specification", "requirements"]),
        ("evaluation", ["evaluation criteria", "award criteria", "scoring", "assessment"]),
        ("pricing", ["pricing", "commercial", "financial", "cost", "budget"]),
        ("timeline", ["timeline", "timetable", "key dates", "milestones", "deadline"]),
        ("qualifications", ["qualification", "selection criteria", "mandatory requirements"]),
        ("social_value", ["social value", "sustainability", "environmental", "community"]),
        ("submission", ["submission", "how to apply", "tender submission", "instructions"]),
    ]

    text_lower = pdf_text.lower()

    for section_name, keywords in section_patterns:
        for keyword in keywords:
            if keyword in text_lower:
                # Find the position and extract surrounding context
                pos = text_lower.find(keyword)
                if pos != -1:
                    # Extract ~2000 chars after the keyword
                    start = max(0, pos - 100)
                    end = min(len(pdf_text), pos + 2000)
                    sections[section_name] = pdf_text[start:end].strip()
                    break

    return sections


def summarize_pdf_for_analysis(pdf_result: dict[str, Any]) -> str:
    """
    Create a summary suitable for LLM analysis.

    Args:
        pdf_result: Result from parse_pdf()

    Returns:
        Formatted string for LLM input
    """
    lines = []

    # Metadata
    if metadata := pdf_result.get("metadata"):
        if title := metadata.get("title"):
            lines.append(f"Document Title: {title}")
        if author := metadata.get("author"):
            lines.append(f"Author: {author}")

    lines.append(f"Pages: {pdf_result.get('page_count', 'Unknown')}")
    lines.append(f"Extraction Method: {pdf_result.get('extraction_method', 'Unknown')}")

    # Main text (truncated for LLM context limits)
    text = pdf_result.get("text", "")
    if text:
        # Limit to ~50k chars for LLM context
        if len(text) > 50000:
            lines.append(f"\nDocument Text (truncated from {len(text)} chars):")
            lines.append(text[:50000] + "\n...[TRUNCATED]...")
        else:
            lines.append(f"\nDocument Text ({len(text)} chars):")
            lines.append(text)

    # Table summary
    if tables := pdf_result.get("tables"):
        lines.append(f"\nTables Found: {len(tables)}")
        for i, table in enumerate(tables[:3]):  # Show first 3 tables
            lines.append(f"\nTable {i+1} (Page {table.get('page')}):")
            data = table.get("data", [])
            for row in data[:5]:  # Show first 5 rows
                lines.append("  | " + " | ".join(str(cell) for cell in row if cell))

    return "\n".join(lines)
