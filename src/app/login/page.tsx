import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to access the DevBlog admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  // Redirect if already logged in
  const session = await getSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-4 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            Admin Login
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in to access the dashboard
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <LoginForm />

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
