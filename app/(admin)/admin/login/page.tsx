"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await loginAction(null, formData);
      if (res.success) {
        // Redirect to dashboard home or previous callbackUrl
        const callbackUrl = searchParams.get("callbackUrl") || "/admin";
        router.push(callbackUrl);
      } else {
        setError(res.error || "Login failed.");
      }
    } catch (err) {
      setError("An unexpected connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background lights */}
      <div className="absolute right-[-10%] top-[-10%] h-[350px] w-[350px] rounded-full bg-brand-orange/15 blur-[120px]" />
      <div className="absolute left-[-10%] bottom-[-10%] h-[350px] w-[350px] rounded-full bg-brand-orange/10 blur-[120px]" />

      <div className="w-full max-w-md z-10 space-y-8">
        
        {/* Brand Logo Header */}
        <div className="text-center">
          <Image
            src="/logo-dark.svg"
            alt="Yankee Gadgets"
            width={180}
            height={52}
            priority
            className="mx-auto h-11 w-auto object-contain mb-2"
          />
          <h2 className="text-sm font-semibold tracking-widest uppercase text-brand-orange">
            Control Console
          </h2>
        </div>

        {/* Login Card */}
        <div className="bg-glass-dark border border-border/10 p-8 rounded-2xl shadow-premium">
          <h1 className="text-xl font-display font-bold text-white mb-6 text-center">
            Admin Log In
          </h1>

          {error && (
            <div className="mb-5 p-3.5 bg-error/10 border border-error/20 text-error text-xs rounded-lg font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="e.g. emeka@yankeegadgets.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ink-900/40 border border-border/10 text-white placeholder-ink-400 text-sm pl-10 pr-4 py-3 rounded-lg focus:border-brand-orange/50 transition-colors"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ink-900/40 border border-border/10 text-white placeholder-ink-400 text-sm pl-10 pr-4 py-3 rounded-lg focus:border-brand-orange/50 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-brand-orange hover:bg-brand-orange-light text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-orange-glow transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-ink-400 hover:text-brand-orange transition-colors"
          >
            ← Back to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
