import { NextRequest, NextResponse } from 'next/server';
import { firebaseAuth } from '../../../../lib/firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, password, confirmPassword, recaptchaToken } = await request.json();

    // Validate input
    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
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

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate phone number if provided
    if (phone) {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { success: false, message: 'Invalid phone number format. Use international format (e.g., +1234567890)' },
          { status: 400 }
        );
      }
    }

    // Validate reCAPTCHA token (in production, verify with Google)
    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA verification required' },
        { status: 400 }
      );
    }

    // Attempt registration with Firebase
    const result = await firebaseAuth.registerWithEmail(email, password, fullName, phone);

    if (result.success && result.user) {
      return NextResponse.json({
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        data: {
          user: result.user,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Registration failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
