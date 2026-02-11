/**
 * Document Parser - Extract text from PDF and DOCX files
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

export interface ParsedDocument {
  text: string;
  pages?: number;
  wordCount: number;
  metadata?: Record<string, unknown>;
}

export interface ParseError {
  error: string;
  details?: string;
}

/**
 * Extract text from a PDF buffer
 */
export async function parsePdf(buffer: Buffer): Promise<ParsedDocument | ParseError> {
  try {
    const data = await pdf(buffer);

    const text = data.text
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();

    return {
      text,
      pages: data.numpages,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      metadata: data.info,
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return {
      error: 'Failed to parse PDF',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Extract text from a DOCX buffer
 */
export async function parseDocx(buffer: Buffer): Promise<ParsedDocument | ParseError> {
  try {
    const result = await mammoth.extractRawText({ buffer });

    const text = result.value
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();

    return {
      text,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      metadata: result.messages.length > 0
        ? { warnings: result.messages }
        : undefined,
    };
  } catch (error) {
    console.error('DOCX parsing error:', error);
    return {
      error: 'Failed to parse DOCX',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Parse a document buffer based on file type
 */
export async function parseDocument(
  buffer: Buffer,
  fileType: string
): Promise<ParsedDocument | ParseError> {
  const type = fileType.toLowerCase();

  if (type === 'application/pdf' || type.endsWith('.pdf')) {
    return parsePdf(buffer);
  }

  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type.endsWith('.docx')
  ) {
    return parseDocx(buffer);
  }

  // Try to detect by content
  const header = buffer.slice(0, 4).toString('hex');
  if (header === '25504446') { // %PDF
    return parsePdf(buffer);
  }
  if (header === '504b0304') { // PK (ZIP, which DOCX uses)
    return parseDocx(buffer);
  }

  return {
    error: 'Unsupported file type',
    details: `File type '${fileType}' is not supported. Please upload a PDF or DOCX file.`,
  };
}

/**
 * Check if a parse result is an error
 */
export function isParseError(result: ParsedDocument | ParseError): result is ParseError {
  return 'error' in result;
}
