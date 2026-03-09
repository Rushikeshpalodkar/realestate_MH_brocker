import { NextResponse } from 'next/server';
import axios from 'axios';

// 2Factor.in API endpoint
const TWOFACTOR_API_URL = 'https://2factor.in/API/V1';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const { sessionId, otp } = await request.json();

    // Validate inputs
    if (!sessionId || !otp) {
      return NextResponse.json(
        { error: 'Session ID and OTP are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate API key
    if (!process.env.TWOFACTOR_API_KEY) {
      console.error('Missing TWOFACTOR_API_KEY in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Verify OTP via 2Factor.in
    const response = await axios.get(
      `${TWOFACTOR_API_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );

    console.log('2Factor.in verify response:', response.data);

    if (response.data.Status === 'Success' && response.data.Details === 'OTP Matched') {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
      }, { headers: corsHeaders });
    } else {
      return NextResponse.json(
        { error: 'Invalid OTP', details: response.data },
        { status: 400, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error verifying OTP:', error.response?.data || error.message);

    return NextResponse.json(
      {
        error: 'Failed to verify OTP',
        details: error.response?.data || error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// GET method for API info
export async function GET() {
  return NextResponse.json({
    message: '2Factor.in OTP Verification API',
    method: 'POST',
    requiredFields: ['sessionId', 'otp'],
    provider: '2Factor.in (Indian SMS Service)',
  }, { headers: corsHeaders });
}
