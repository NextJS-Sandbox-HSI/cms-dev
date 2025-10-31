"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await loginAction(null, formData);

      if (result.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setServerError(result.error || "Login failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Server Error */}
      {serverError && (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {serverError}
          </p>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50"
        >
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          disabled={isPending}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          placeholder="admin@example.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50"
        >
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          disabled={isPending}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
