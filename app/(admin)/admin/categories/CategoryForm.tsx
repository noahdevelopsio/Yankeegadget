"use client";

import React, { useState } from "react";
import { createCategory } from "@/app/actions/admin";
import { Loader2 } from "lucide-react";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!name.trim()) {
      setError("Please fill in the category name.");
      setLoading(false);
      return;
    }

    try {
      const res = await createCategory(name);
      if (res.success) {
        setName("");
        setSuccess(true);
      } else {
        setError(res.error || "Failed to create category.");
      }
    } catch (err) {
      setError("A connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-error/15 border border-error/20 text-error text-xs rounded-lg font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg font-medium">
          Category created successfully!
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="e.g. Smart Watches"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-orange hover:bg-brand-orange-light text-white font-bold py-3 rounded-lg flex items-center justify-center gap-1.5 shadow-premium transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          <span>Save Category</span>
        )}
      </button>
    </form>
  );
}
