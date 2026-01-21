import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// Ensure this module and its server actions run on Node.js (not the Edge runtime)
export const runtime = "nodejs";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

// Encrypts the payload into a JWT token.
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 hour")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData) {
  //This function logins a user.
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  //Validation on the server.
  if (!email || !password) throw new Error("Are you kidding me?");
  const { verifyUser } = await import("./lib/auth");
  const user = await verifyUser(email, password);
  if (!user) throw new Error("Please stop. Just, no...");
  //Verify login session
  const sessionUser = {
    email: user.email,
    name: user.username ?? user.email.split("@")[0],
  };
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ user: sessionUser, expires });
  (await cookies()).set({
    name: "session",
    value: session,
    httpOnly: true,
    expires,
  });
}

export async function register(formData: FormData) {
  //This function registers a user.
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  //Validation on the server.
  if (!email || !password) throw new Error("Are you kidding me?");
  //Registering attempts to login:
  try {
    const { registerUser } = await import("./lib/auth");
    const created = await registerUser({
      email,
      password,
      username: formData.get("username")?.toString().trim() ?? undefined,
    });
    //Create the session
    const user = {
      email: created.email,
      name: created.username ?? created.email.split("@")[0],
    };
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const session = await encrypt({ user, expires });
    (await cookies()).set({
      name: "session",
      value: session,
      httpOnly: true,
      expires,
    });
  } catch (err: any) {
    if (err?.code === 11000 /*mongo duplicate key*/)
      throw new Error(
        "You obviously had that email. Why don't you log-in instead?",
      );
    throw err;
  }
}

export async function logout() {
  // Destroy the session
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  //Sessions last for exactly 1 hour.
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  try {
    const parsed = await decrypt(session);
    //Enforce that 1-hour lifetime.
    if (parsed.expires && new Date(parsed.expires) < new Date()) {
      return null;
    }
    return parsed;
  } catch (err: any) {
    if (err?.code === "ERR_JWT_EXPIRED") {
      //Go back to logging in.
      return null;
    }
    // Rethrow the other errors.
    throw err;
  }
}

export async function updateSession(request: NextRequest) {
  // Grab the session cookie
  const session = request.cookies.get("session")?.value;
  if (!session) return; // No session — nothing to update

  let parsed: any;

  try {
    // Refresh the session so it doesn't expire.
    parsed = await decrypt(session);

    // Did the session manually expire?
    if (parsed.expires && new Date(parsed.expires) < new Date()) {
      return; // Already expired — do not refresh
    }
  } catch (err: any) {
    // Catch expired or corrupted tokens
    if (err?.code === "ERR_JWT_EXPIRED") {
      // Go back to logging in.
      return;
    }
    // Corrupted or invalid token
    console.error("Invalid session token:", err);
    return;
  }

  // Refresh the session so it doesn't expire
  parsed.expires = new Date(Date.now() + 60 * 60 * 1000); // +1 hour
  const refreshedSession = await encrypt(parsed);

  // Create the NextResponse and set the refreshed cookie
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: refreshedSession,
    httpOnly: true,
    expires: parsed.expires,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
