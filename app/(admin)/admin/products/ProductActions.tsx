"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toggleProductPublish, deleteProduct } from "@/app/actions/admin";
import { Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

interface ProductActionsProps {
  id: string;
  isPublished: boolean;
}

export default function ProductActions({ id, isPublished }: ProductActionsProps) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await toggleProductPublish(id);
      if (!res.success) {
        alert(res.error || "Failed to update status.");
      }
    } catch (err) {
      alert("Connection error.");
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this product? This action cannot be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      const res = await deleteProduct(id);
      if (!res.success) {
        alert(res.error || "Failed to delete product.");
      }
    } catch (err) {
      alert("Connection error.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex justify-end items-center gap-2">
      {/* Toggle Publish State */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        className={`p-2 rounded-lg hover:bg-surface-alt transition-colors ${
          isPublished ? "text-green-600 hover:text-green-700" : "text-ink-400 hover:text-ink-900"
        }`}
        title={isPublished ? "Set to Draft" : "Publish Product"}
      >
        {toggling ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPublished ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>

      {/* Edit Link */}
      <Link
        href={`/admin/products/${id}/edit`}
        className="p-2 rounded-lg text-brand-orange hover:text-brand-orange-light hover:bg-surface-alt transition-colors"
        title="Edit Product"
      >
        <Edit className="w-4 h-4" />
      </Link>

      {/* Delete Trigger */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 rounded-lg text-error hover:text-red-700 hover:bg-surface-alt transition-colors"
        title="Delete Product"
      >
        {deleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
