import { NextRequest, NextResponse } from 'next/server';
import { JSON_SERVER_URL, API_ENDPOINTS } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(API_ENDPOINTS.RESPONSES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create response');
    }
    
    const data = await response.json();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Response created successfully',
        data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create response' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get('proposalId');
    const email = searchParams.get('email');
    
    let url = API_ENDPOINTS.RESPONSES;
    const params = new URLSearchParams();
    
    if (proposalId) {
      params.append('proposalId', proposalId);
    }
    if (email) {
      params.append('email_like', email);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch responses');
    }
    
    const data = await response.json();
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch responses' },
      { status: 500 }
    );
  }
}
