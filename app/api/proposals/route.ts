import { NextRequest, NextResponse } from 'next/server';
import { JSON_SERVER_URL, API_ENDPOINTS } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(API_ENDPOINTS.PROPOSALS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create proposal');
    }
    
    const data = await response.json();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Proposal created successfully',
        data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create proposal' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(API_ENDPOINTS.PROPOSALS);
    
    if (!response.ok) {
      throw new Error('Failed to fetch proposals');
    }
    
    const data = await response.json();
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}
