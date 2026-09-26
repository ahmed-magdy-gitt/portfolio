import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in every field before sending." },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  try {
    // ---------------------------------------------------------------------
    // Plug in a real email provider here. This route validates the payload
    // and responds with success/failure today, but nothing is delivered
    // anywhere until one of the providers below (or your own) is wired in.
    //
    // Option A — Resend (https://resend.com), recommended for Next.js:
    //   1. `npm install resend`
    //   2. Set RESEND_API_KEY in your environment (.env.local + hosting env vars)
    //   3. Uncomment:
    //
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Portfolio <onboarding@resend.dev>", // or your verified domain
    //   to: "ahmedmagdy707007@gmail.com",
    //   subject: `Portfolio inquiry from ${name}`,
    //   replyTo: email,
    //   text: `${message}\n\n— ${name} (${email})`,
    // });
    //
    // Option B — SendGrid: npm install @sendgrid/mail, set SENDGRID_API_KEY,
    // then sgMail.send({ to, from, subject, text }).
    //
    // Option C — Nodemailer + SMTP (e.g. Gmail app password) via
    // nodemailer.createTransport({...}).sendMail({...}).
    // ---------------------------------------------------------------------

    console.log("New portfolio inquiry:", { name, email, message });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }
}
