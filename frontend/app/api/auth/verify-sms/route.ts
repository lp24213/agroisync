import { NextRequest, NextResponse } from 'next/server';
import { firebaseAuth } from '../../../../lib/firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    // Validate input
    if (!phone || !code) {
      return NextResponse.json(
        { success: false, message: 'Phone number and verification code are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate verification code format (6 digits)
    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code format' },
        { status: 400 }
      );
    }

    // Verify SMS code
    const result = await firebaseAuth.verifySMSCode(code);

    if (result.success && result.user) {
      // Create session token
      const sessionToken = `sms_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return NextResponse.json({
        success: true,
        message: 'SMS verification successful',
        data: {
          user: result.user,
          token: sessionToken,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'SMS verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('SMS verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
