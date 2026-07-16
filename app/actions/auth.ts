"use server";

import prisma from "@/lib/prisma";
import { verifyPassword, createSession, logoutSession } from "@/lib/auth";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Please enter both email and password." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return { success: false, error: "Invalid credentials or unauthorized access role." };
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid credentials or password." };
    }

    // Set cookie session logs
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return { success: true };

  } catch (error) {
    console.error("Login Server Action failure:", error);
    return { success: false, error: "A server error occurred. Please try again." };
  }
}

export async function logoutAction() {
  await logoutSession();
}
