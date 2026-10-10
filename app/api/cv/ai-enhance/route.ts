import { NextRequest, NextResponse } from 'next/server';
import { runGenerativeAIAutoFill, AIEnhancementOptions } from '../../../../lib/cv/ai-enhancer';
import { ParsedCVData } from '../../../../lib/cv/parser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { baseData, rawText, options } = body as {
      baseData: ParsedCVData;
      rawText: string;
      options?: AIEnhancementOptions;
    };

    if (!baseData) {
      return NextResponse.json(
        { error: 'Missing baseData object for AI enhancement.' },
        { status: 400 }
      );
    }

    const enhanced = await runGenerativeAIAutoFill(
      baseData,
      rawText || '',
      options || {}
    );

    return NextResponse.json({
      success: true,
      data: enhanced,
    });
  } catch (err: any) {
    console.error('AI Enhance API route error:', err);
    return NextResponse.json(
      { error: err.message || 'Error executing Generative AI Portfolio enhancement.' },
      { status: 500 }
    );
  }
}
