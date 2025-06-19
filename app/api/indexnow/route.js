import { submitUrlToIndexNow, submitUrlsToIndexNow, submitAllArticlesToIndexNow } from '../../../utils/indexNow';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url, urls, type } = await request.json();

    // Validate request
    if (!type) {
      return NextResponse.json(
        { error: 'Type parameter is required' },
        { status: 400 }
      );
    }

    let result = false;

    switch (type) {
      case 'single':
        if (!url) {
          return NextResponse.json(
            { error: 'URL parameter is required for single submission' },
            { status: 400 }
          );
        }
        result = await submitUrlToIndexNow(url);
        break;

      case 'multiple':
        if (!urls || !Array.isArray(urls)) {
          return NextResponse.json(
            { error: 'URLs array is required for multiple submission' },
            { status: 400 }
          );
        }
        result = await submitUrlsToIndexNow(urls);
        break;

      case 'all':
        result = await submitAllArticlesToIndexNow();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use "single", "multiple", or "all"' },
          { status: 400 }
        );
    }

    if (result) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'URLs submitted to IndexNow successfully' 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to submit URLs to IndexNow' 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('IndexNow API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    { 
      service: 'IndexNow API',
      status: 'healthy',
      keyFile: 'https://urmichakraborty.com/ab6a76142afb478687203d747ba106f1.txt'
    },
    { status: 200 }
  );
} 