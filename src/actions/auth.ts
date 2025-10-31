"use server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import {
  createSession,
  setSessionCookie,
  deleteSessionCookie,
} from "@/lib/session";
import { redirect } from "next/navigation";
import { loginSchema } from "@/schemas";

export interface LoginResult {
  success: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
}

/**
 * Server action to handle user login
 */
export async function loginAction(
  _prevState: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  try {
    // Extract raw data
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validate with Zod
    const validation = loginSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create session
    const token = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Set session cookie
    await setSessionCookie(token);

    // Redirect will be handled by the component
    return {
      success: true,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login. Please try again.",
    };
  }
}

/**
 * Server action to handle user logout
 */
export async function logoutAction(): Promise<void> {
  await deleteSessionCookie();
  redirect("/");
}

/**
 * Server action to check authentication status
 */
export async function checkAuth(): Promise<{
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
}> {
  try {
    const session = await (await import("@/lib/session")).getSession();

    if (!session) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
      },
    };
  } catch (error) {
    return { isAuthenticated: false };
  }
}
