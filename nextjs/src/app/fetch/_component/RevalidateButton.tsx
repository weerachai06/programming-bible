"use client";

import { useState } from "react";
import { revalidatePosts } from "./actions";

export default function RevalidateButton() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRevalidate = async () => {
    setLoading(true);
    try {
      const result = await revalidatePosts();
      const thaiTime = new Date(result.timestamp).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setStatus(`Last revalidated: ${thaiTime}`);
    } catch (error) {
      console.error("Revalidation failed:", error);
      setStatus("Revalidation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button
          onClick={handleRevalidate}
          disabled={loading}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Purging..." : "Purge Cache"}
        </button>
      </div>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
