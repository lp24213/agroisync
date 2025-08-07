import { NextRequest, NextResponse } from 'next/server';
import { firebaseAuth } from '../../../../lib/firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, recaptchaToken } = await request.json();

    // Validate input
    if (!phoneNumber || !recaptchaToken) {
      return NextResponse.json(
        { success: false, message: 'Phone number and reCAPTCHA token are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format. Use international format (e.g., +1234567890)' },
        { status: 400 }
      );
    }

    // Send SMS verification code
    const result = await firebaseAuth.sendSMSCode(phoneNumber, recaptchaToken);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'SMS verification code sent successfully.',
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send SMS verification code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Send SMS error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
