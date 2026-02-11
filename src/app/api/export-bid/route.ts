import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  TableOfContents,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from 'docx';

interface ExportRequestBody {
  documentId?: string;
  tenderOcid?: string;
  includeTableOfContents?: boolean;
  includeWordCounts?: boolean;
  companyName?: string;
}

interface TenderInfo {
  title: string;
  buyerName: string;
  deadline: string | null;
}

interface RequirementRow {
  id: string;
  requirement_number: string | null;
  title: string | null;
  description: string | null;
  requirement_type: string | null;
  word_limit: number | null;
  weighting: number | null;
  section_reference: string | null;
  response_text: string | null;
  word_count: number | null;
  status: string | null;
}

// POST /api/export-bid - Generate Word document with bid responses
export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ExportRequestBody = await request.json();
    const { documentId, tenderOcid, includeTableOfContents = true, includeWordCounts = true } = body;

    if (!documentId && !tenderOcid) {
      return NextResponse.json({ error: 'documentId or tenderOcid is required' }, { status: 400 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id, company_name FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;
    const companyName = body.companyName || profileResult[0].company_name || 'Bidder';

    let tenderInfo: TenderInfo | null = null;
    let requirementsResult: RequirementRow[] = [];

    if (tenderOcid) {
      // Tender-based export (new flow)
      const tenderResult = await sql`
        SELECT title, buyer_name, tender_end_date
        FROM tenders
        WHERE ocid = ${tenderOcid}
      `;

      if (tenderResult.length === 0) {
        return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
      }

      tenderInfo = {
        title: tenderResult[0].title as string,
        buyerName: tenderResult[0].buyer_name as string,
        deadline: tenderResult[0].tender_end_date as string | null,
      };

      // Get requirements and responses for this tender
      const reqResult = await sql`
        SELECT
          br.id,
          br.requirement_number,
          br.title,
          br.description,
          br.requirement_type,
          br.word_limit,
          br.weighting,
          br.section_reference,
          resp.response_text,
          resp.word_count,
          resp.status
        FROM bid_requirements br
        LEFT JOIN bid_responses resp ON resp.requirement_id = br.id
          AND resp.company_profile_id = ${companyProfileId}
        WHERE br.tender_ocid = ${tenderOcid}
        ORDER BY br.sort_order
      `;

      requirementsResult = reqResult as RequirementRow[];
    } else if (documentId) {
      // Document-based export (legacy flow)
      const docResult = await sql`
        SELECT
          td.id,
          td.file_name,
          td.analysis_result
        FROM tender_documents td
        WHERE td.id = ${documentId}
        AND td.company_profile_id = ${companyProfileId}
      `;

      if (docResult.length === 0) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      const doc = docResult[0];
      const analysis = doc.analysis_result as {
        contractTitle?: string;
        buyerName?: string;
        submissionDeadline?: string;
        summary?: string;
      } | null;

      tenderInfo = {
        title: analysis?.contractTitle || 'Tender Response',
        buyerName: analysis?.buyerName || '',
        deadline: analysis?.submissionDeadline || null,
      };

      // Get requirements and responses
      const reqResult = await sql`
        SELECT
          br.id,
          br.requirement_number,
          br.title,
          br.description,
          br.requirement_type,
          br.word_limit,
          br.weighting,
          br.section_reference,
          resp.response_text,
          resp.word_count,
          resp.status
        FROM bid_requirements br
        LEFT JOIN bid_responses resp ON resp.requirement_id = br.id
          AND resp.company_profile_id = ${companyProfileId}
        WHERE br.document_id = ${documentId}
        ORDER BY br.sort_order
      `;

      requirementsResult = reqResult as RequirementRow[];
    }

    if (!tenderInfo) {
      return NextResponse.json({ error: 'Could not determine tender info' }, { status: 400 });
    }

    // Build the Word document
    const children: (Paragraph | Table | TableOfContents)[] = [];

    // Title Page
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '', break: 1 })],
      })
    );
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '', break: 1 })],
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: tenderInfo.title,
            bold: true,
            size: 56,
          }),
        ],
      })
    );
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        children: [
          new TextRun({
            text: `Submitted by ${companyName}`,
            size: 32,
            color: '666666',
          }),
        ],
      })
    );
    if (tenderInfo.buyerName) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: `For: ${tenderInfo.buyerName}`,
              size: 28,
              color: '888888',
            }),
          ],
        })
      );
    }
    if (tenderInfo.deadline) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: `Submission Date: ${new Date(tenderInfo.deadline).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}`,
              size: 24,
              color: '888888',
            }),
          ],
        })
      );
    }

    // Page break after title
    children.push(
      new Paragraph({
        children: [new PageBreak()],
      })
    );

    // Table of Contents
    if (includeTableOfContents) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: 'Table of Contents', bold: true })],
        })
      );
      children.push(
        new TableOfContents('Table of Contents', {
          hyperlink: true,
          headingStyleRange: '1-3',
        })
      );
      children.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    // Requirements and Responses
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Response to Requirements', bold: true })],
      })
    );

    for (const req of requirementsResult) {
      // Requirement heading
      const headingText = `${req.requirement_number || ''} ${req.title || 'Requirement'}`.trim();
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400 },
          children: [new TextRun({ text: headingText, bold: true })],
        })
      );

      // Requirement metadata table
      const metadataRows: TableRow[] = [];

      if (req.requirement_type) {
        metadataRows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: 'Type:', bold: true })] })],
              }),
              new TableCell({
                width: { size: 7000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: req.requirement_type })] })],
              }),
            ],
          })
        );
      }

      if (req.word_limit) {
        metadataRows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: 'Word Limit:', bold: true })] })],
              }),
              new TableCell({
                width: { size: 7000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: `${req.word_limit} words` })] })],
              }),
            ],
          })
        );
      }

      if (req.weighting) {
        metadataRows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: 2000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: 'Weighting:', bold: true })] })],
              }),
              new TableCell({
                width: { size: 7000, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: `${req.weighting}%` })] })],
              }),
            ],
          })
        );
      }

      if (metadataRows.length > 0) {
        children.push(
          new Table({
            rows: metadataRows,
            width: { size: 9000, type: WidthType.DXA },
          })
        );
      }

      // Requirement description (in italics)
      if (req.description) {
        children.push(
          new Paragraph({
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({ text: 'Requirement: ', bold: true }),
              new TextRun({ text: req.description, italics: true, color: '666666' }),
            ],
          })
        );
      }

      // Response
      children.push(
        new Paragraph({
          spacing: { before: 200 },
          children: [new TextRun({ text: 'Response:', bold: true })],
        })
      );

      if (req.response_text) {
        // Split response into paragraphs
        const responseParagraphs = req.response_text.split('\n\n');
        for (const para of responseParagraphs) {
          if (para.trim()) {
            children.push(
              new Paragraph({
                spacing: { after: 120 },
                children: [new TextRun({ text: para.trim() })],
              })
            );
          }
        }

        // Word count footer
        if (includeWordCounts && req.word_count) {
          const isOverLimit = req.word_limit && req.word_count > req.word_limit;
          children.push(
            new Paragraph({
              spacing: { before: 100 },
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: `Word count: ${req.word_count}${req.word_limit ? ` / ${req.word_limit}` : ''}`,
                  size: 18,
                  color: isOverLimit ? 'CC0000' : '888888',
                  italics: true,
                }),
              ],
            })
          );
        }
      } else {
        children.push(
          new Paragraph({
            spacing: { after: 200 },
            shading: { fill: 'FFF3CD' },
            children: [
              new TextRun({
                text: '[Response not yet provided]',
                italics: true,
                color: '856404',
              }),
            ],
          })
        );
      }
    }

    // Compliance Summary Table
    children.push(
      new Paragraph({
        children: [new PageBreak()],
      })
    );
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Compliance Summary', bold: true })],
      })
    );

    const summaryRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: '0D9488' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Requirement', bold: true, color: 'FFFFFF' })] })],
          }),
          new TableCell({
            shading: { fill: '0D9488' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Type', bold: true, color: 'FFFFFF' })] })],
          }),
          new TableCell({
            shading: { fill: '0D9488' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Status', bold: true, color: 'FFFFFF' })] })],
          }),
          new TableCell({
            shading: { fill: '0D9488' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Word Count', bold: true, color: 'FFFFFF' })] })],
          }),
        ],
      }),
    ];

    for (const req of requirementsResult) {
      const status = req.response_text ? (req.status || 'Draft') : 'Not Started';
      const wordInfo = req.response_text
        ? `${req.word_count || 0}${req.word_limit ? ` / ${req.word_limit}` : ''}`
        : '-';

      summaryRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `${req.requirement_number || ''} ${req.title || ''}`.trim() })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: req.requirement_type || '-' })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({
                text: status,
                color: status === 'Not Started' ? 'CC0000' : status === 'Draft' ? 'CC8800' : '008800',
              })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: wordInfo })] })],
            }),
          ],
        })
      );
    }

    children.push(
      new Table({
        rows: summaryRows,
        width: { size: 9000, type: WidthType.DXA },
      })
    );

    // Create the document
    const wordDoc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
      styles: {
        paragraphStyles: [
          {
            id: 'Normal',
            name: 'Normal',
            run: {
              font: 'Calibri',
              size: 24,
            },
            paragraph: {
              spacing: { line: 276 },
            },
          },
        ],
      },
    });

    // Generate the buffer
    const buffer = await Packer.toBuffer(wordDoc);

    // Generate filename
    const sanitizedTitle = tenderInfo.title
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    const filename = `${sanitizedTitle}_${new Date().toISOString().split('T')[0]}.docx`;

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(buffer);

    // Return the document
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting bid:', error);
    return NextResponse.json(
      { error: 'Failed to export bid', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
