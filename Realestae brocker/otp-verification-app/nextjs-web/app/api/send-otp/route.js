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
    const { phoneNumber } = await request.json();

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
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

    // Clean phone number (remove +91 if present)
    const cleanPhone = phoneNumber.replace(/^\+91/, '').replace(/\s/g, '');

    // Send OTP via 2Factor.in
    const response = await axios.get(
      `${TWOFACTOR_API_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/${cleanPhone}/AUTOGEN`
    );

    console.log('2Factor.in response:', response.data);

    if (response.data.Status === 'Success') {
      return NextResponse.json({
        success: true,
        sessionId: response.data.Details,
        message: 'OTP sent successfully',
      }, { headers: corsHeaders });
    } else {
      return NextResponse.json(
        { error: 'Failed to send OTP', details: response.data },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error sending OTP:', error.response?.data || error.message);

    return NextResponse.json(
      {
        error: 'Failed to send OTP',
        details: error.response?.data || error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// GET method for API info
export async function GET() {
  return NextResponse.json({
    message: '2Factor.in OTP Sending API',
    method: 'POST',
    requiredFields: ['phoneNumber'],
    provider: '2Factor.in (Indian SMS Service)',
  }, { headers: corsHeaders });
}
