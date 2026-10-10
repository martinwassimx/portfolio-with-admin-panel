import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { parseCVText } from '../../../../lib/cv/parser';

async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {
  try {
    const { extractText } = await import('unpdf');
    const result = await extractText(new Uint8Array(buffer));
    if (Array.isArray(result.text)) {
      return result.text.join('\n');
    }
    if (typeof result.text === 'string') {
      return result.text;
    }
  } catch (unpdfErr) {
    console.warn('unpdf extraction failed, falling back:', unpdfErr);
  }

  // Fallback: check if buffer has readable ascii text streams
  const str = buffer.toString('utf-8');
  if (str.length > 50 && (str.includes('Education') || str.includes('Experience') || str.includes('Skills'))) {
    return str;
  }

  throw new Error('Could not extract text from PDF document.');
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let rawText = '';
    let uploadedFileUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const directText = formData.get('text') as string | null;

      if (directText && directText.trim().length > 0) {
        rawText = directText;
      }

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = file.name;

        // Save CV file locally as the downloadable portfolio CV
        const safePath = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        try {
          const docsDir = path.join(process.cwd(), 'public', 'uploads');
          await fs.mkdir(docsDir, { recursive: true });
          await fs.writeFile(path.join(docsDir, safePath), buffer);
          uploadedFileUrl = `/uploads/${safePath}`;
        } catch (e) {
          console.warn('Failed saving CV document locally:', e);
        }

        // If it's a PDF, extract text using unpdf
        if (file.type.includes('pdf') || filename.toLowerCase().endsWith('.pdf')) {
          try {
            rawText = await extractTextFromPDFBuffer(buffer);
          } catch (pdfErr: any) {
            console.error('PDF parsing error:', pdfErr);
            return NextResponse.json(
              { error: 'Failed to extract text from PDF file. Please ensure it is a text-based PDF or paste text directly.' },
              { status: 400 }
            );
          }
        } else {
          // Plain text or markdown
          rawText = buffer.toString('utf-8');
        }
      }
    } else {
      // JSON body
      const body = await req.json();
      rawText = body.text || '';
    }

    if (!rawText || rawText.trim().length < 15) {
      return NextResponse.json(
        { error: 'No readable resume text found. Please upload a valid CV PDF or paste your resume text.' },
        { status: 400 }
      );
    }

    // Parse CV text into structured portfolio entities
    const parsedData = parseCVText(rawText);

    // Check if auto AI enhancement is enabled
    const aiEnhance = req.nextUrl.searchParams.get('ai') === 'true';
    let finalData = parsedData;

    if (aiEnhance) {
      try {
        const { runGenerativeAIAutoFill } = await import('../../../../lib/cv/ai-enhancer');
        finalData = await runGenerativeAIAutoFill(parsedData, rawText, {
          tone: 'senior_engineer',
        });
      } catch (aiErr) {
        console.warn('AI Auto-Fill enhancement error:', aiErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: finalData,
      cvFileUrl: uploadedFileUrl || undefined,
    });
  } catch (err: any) {
    console.error('CV parse route error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal error parsing CV.' },
      { status: 500 }
    );
  }
}
