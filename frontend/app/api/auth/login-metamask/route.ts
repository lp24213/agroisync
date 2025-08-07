import { NextRequest, NextResponse } from 'next/server';
import { firebaseAuth } from '../../../../lib/firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, message } = await request.json();

    // Validate input
    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { success: false, message: 'Wallet address, signature, and message are required' },
        { status: 400 }
      );
    }

    // Validate wallet address format (basic Ethereum address validation)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(walletAddress)) {
      return NextResponse.json(
        { success: false, message: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Attempt wallet authentication with Firebase
    const result = await firebaseAuth.authenticateWithWallet(
      walletAddress,
      signature,
      message,
      'ethereum' // Assuming Ethereum for Metamask
    );

    if (result.success && result.user) {
      // Create session token
      const sessionToken = `wallet_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return NextResponse.json({
        success: true,
        message: 'Wallet authentication successful',
        data: {
          user: result.user,
          token: sessionToken,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Wallet authentication failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Metamask login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
