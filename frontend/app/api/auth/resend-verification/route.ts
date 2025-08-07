import { NextRequest, NextResponse } from 'next/server';
import { firebaseAuth } from '../../../../lib/firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    // Validate input
    if (!email || !type) {
      return NextResponse.json(
        { success: false, message: 'Email and verification type are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate verification type
    if (!['email', 'sms'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification type. Must be "email" or "sms"' },
        { status: 400 }
      );
    }

    let result;

    if (type === 'email') {
      // Resend email verification
      result = await firebaseAuth.sendPasswordResetEmail(email);
    } else {
      // For SMS, we would need the phone number
      // This is a placeholder - in a real implementation, you'd get the phone from the user profile
      return NextResponse.json(
        { success: false, message: 'SMS resend not implemented yet' },
        { status: 400 }
      );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Verification ${type === 'email' ? 'email' : 'SMS'} resent successfully.`,
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || `Failed to resend ${type} verification` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
