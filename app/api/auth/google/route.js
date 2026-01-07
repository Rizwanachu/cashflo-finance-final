import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      email: payload.email,
      name: payload.name,
      sub: payload.sub,
    }, { status: 200 });

  } catch (err) {
    console.error("Google auth error:", err);
    return NextResponse.json({
      error: "Google authentication failed",
      message: err.message,
    }, { status: 500 });
  }
}
