import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api-config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    console.log('Fetching proposal with ID:', id);
    console.log('API Endpoint:', `${API_ENDPOINTS.PROPOSALS}/${id}`);

    const response = await fetch(`${API_ENDPOINTS.PROPOSALS}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('JSON Server response status:', response.status);
    console.log('JSON Server response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('JSON Server response not ok:', response.status);
      console.error('Error response body:', errorText);
      return NextResponse.json(
        { success: false, message: `Failed to fetch proposal: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('JSON Server response data:', data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { success: false, message: `Failed to fetch proposal: ${String(error)}` },
      { status: 500 }
    );
  }
}
