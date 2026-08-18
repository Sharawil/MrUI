import { NextResponse } from 'next/server';
import { parseGeminiResponse, validateGeneratedProject } from '@/lib/code-parser';
import { model } from '@/lib/gemini';
import { GENERATION_PROMPT } from '@/lib/prompts';

export const maxDuration = 60; // Maximum 60 seconds for API route

export async function POST(request: Request) {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Your Gemini key is missing.' },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const screenshot = formData.get('screenshot') as File;
    const instructions = formData.get('instructions') as string || '';

    // Validate file
    if (!screenshot) {
      return NextResponse.json(
        { error: 'No screenshot uploaded.' },
        { status: 400 }
      );
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(screenshot.type)) {
      return NextResponse.json(
        { error: 'This image format is not supported. Please upload PNG, JPG, or WebP.' },
        { status: 400 }
      );
    }

    if (screenshot.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const arrayBuffer = await screenshot.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    // Prepare the prompt with instructions
    const prompt = GENERATION_PROMPT.replace('{{instructions}}', instructions);

    // Generate content with Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: screenshot.type,
        },
      },
    ]);

    const responseText = await result.response.text();
    // Parse and validate the response
    let generatedProject;
    try {
      generatedProject = parseGeminiResponse(responseText);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return NextResponse.json(
        { error: 'Gemini could not generate usable code. Try a clearer screenshot.' },
        { status: 422 }
      );
    }

    // Validate the generated project
    if (!validateGeneratedProject(generatedProject)) {
      return NextResponse.json(
        { error: 'Generated code is incomplete or invalid. Please try again.' },
        { status: 422 }
      );
    }

    return NextResponse.json(generatedProject);
  } catch (error: unknown) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : '';
    const status = typeof error === 'object' && error !== null && 'status' in error
      ? Number((error as { status?: number }).status)
      : undefined;

    // Handle specific error types
    if (status === 401 || status === 403 || /api key|authentication/i.test(message)) {
      return NextResponse.json(
        { error: 'Your Gemini key is missing or invalid.' },
        { status: 500 }
      );
    }

    if (status === 429 || /quota|rate limit|resource exhausted/i.test(message)) {
      return NextResponse.json(
        { error: 'The request limit was reached. Please wait and try again.' },
        { status: 429 }
      );
    }

    if (status === 503 || /high demand|service unavailable|temporarily unavailable/i.test(message)) {
      return NextResponse.json(
        { error: 'Gemini is busy right now. Please wait a few minutes and try again.' },
        { status: 503 }
      );
    }

    if (status === 404 || /model.*not found|no longer available/i.test(message)) {
      return NextResponse.json(
        { error: 'The configured Gemini model is unavailable. Please restart MrUI and try again.' },
        { status: 502 }
      );
    }

    if (/fetch failed|network|econnreset|enotfound/i.test(message)) {
      return NextResponse.json(
        { error: 'MrUI could not reach Gemini. Check your internet connection and try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
