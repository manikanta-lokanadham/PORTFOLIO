import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    const date = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lokanadhammanikanta123@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Send only one email to the sender
    await transporter.sendMail({
      from: '"Manikanta Lokanadham" <lokanadhammanikanta123@gmail.com>',
      to: email,
      subject: 'Thank you for contacting Manikanta Lokanadham',
      html: `
        <div style="background-color: #0a0a0a; color: #ffffff; font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: bold; background: linear-gradient(to right, #a855f7, #ec4899, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">MK.</div>
          </div>
          
          <div style="background: linear-gradient(to right, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #ffffff; margin-bottom: 10px;">Dear ${name},</h2>
            <p style="color: #a1a1aa;">Thank you for reaching out! I have received your message and will get back to you soon.</p>
          </div>

          <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #ffffff; margin-bottom: 10px;">Your Message Details:</h3>
            <p style="color: #a1a1aa; margin-bottom: 5px;"><strong>Date:</strong> ${date}</p>
            <p style="color: #a1a1aa; margin-bottom: 5px;"><strong>Email:</strong> ${email}</p>
            <div style="background: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; margin-top: 10px;">
              <p style="color: #a1a1aa; margin: 0;">${message}</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="color: #ffffff; font-weight: bold; margin-bottom: 5px;">Manikanta Lokanadham</p>
            <p style="color: #a1a1aa; margin-bottom: 15px;">UI/UX Designer & Developer</p>
            <div style="margin-bottom: 20px;">
              <a href="https://manikanta-portfolio.vercel.app" style="background: linear-gradient(to right, #a855f7, #ec4899, #ef4444); padding: 10px 20px; border-radius: 5px; color: #ffffff; text-decoration: none; font-weight: bold;">View Portfolio</a>
            </div>
            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">
              <a href="https://www.linkedin.com/in/manikanta-lokanadhamm/" style="color: #a1a1aa; text-decoration: none;">LinkedIn</a>
              <span style="color: #a1a1aa;">•</span>
              <a href="https://www.behance.net/Manikanta-Lokanadham" style="color: #a1a1aa; text-decoration: none;">Behance</a>
              <span style="color: #a1a1aa;">•</span>
              <a href="https://mkedito.wordpress.com/" style="color: #a1a1aa; text-decoration: none;">Blog</a>
            </div>
          </div>
        </div>
      `
    });

    // Send only one notification to yourself
    await transporter.sendMail({
      from: '"Portfolio Contact Form" <lokanadhammanikanta123@gmail.com>',
      to: 'lokanadhammanikanta123@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="background-color: #0a0a0a; color: #ffffff; font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: bold; background: linear-gradient(to right, #a855f7, #ec4899, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">New Message Received</div>
          </div>
          
          <div style="background: linear-gradient(to right, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #ffffff; margin-bottom: 10px;">Contact Form Submission</h2>
            <p style="color: #a1a1aa;">You have received a new message from your portfolio website.</p>
          </div>

          <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px;">
            <h3 style="color: #ffffff; margin-bottom: 15px;">Sender Details:</h3>
            <p style="color: #a1a1aa; margin-bottom: 5px;"><strong>Name:</strong> ${name}</p>
            <p style="color: #a1a1aa; margin-bottom: 5px;"><strong>Email:</strong> ${email}</p>
            <p style="color: #a1a1aa; margin-bottom: 5px;"><strong>Date:</strong> ${date}</p>
            <div style="background: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 8px; margin-top: 15px;">
              <h4 style="color: #ffffff; margin-bottom: 10px;">Message:</h4>
              <p style="color: #a1a1aa; margin: 0;">${message}</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <a href="mailto:${email}" style="background: linear-gradient(to right, #a855f7, #ec4899, #ef4444); padding: 10px 20px; border-radius: 5px; color: #ffffff; text-decoration: none; font-weight: bold;">Reply to ${name}</a>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
} 