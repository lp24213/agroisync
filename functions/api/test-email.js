import { Resend } from 'resend';

export async function onRequest(context) {
  const { env } = context;
  
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: 'test@agroisync.com',
      subject: 'Test Connection',
      html: '<p>Test email from AgroSync</p>'
    });

    return Response.json({
      success: true,
      emailId: result.data?.id
    });
  } catch (error) {
    console.error('Resend Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}