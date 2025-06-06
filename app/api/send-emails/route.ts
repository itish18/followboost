import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export  async function POST(req: Request, res: Response) {
 
  const { to, subject, html } = await req.json();

  

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to:'itish.v007@gmail.com',
      subject,
      html,
    });

   

    if (!data.data) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ 
      success: true, 
      messageId: data.data.id 
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
