"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadProof({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMsg(null);

    try {
      const formData = new FormData();
formData.append("file", file);

const res = await fetch(`/api/payments/${paymentId}/proof`, {
  method: "POST",
  body: formData,
  credentials: "include",
});


      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error subiendo comprobante");
      }

      setMsg("Comprobante enviado ✅");
      router.refresh();
    } catch (err: any) {
      setMsg(err?.message || "Error");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ cursor: loading ? "not-allowed" : "pointer" }}>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={onChange}
          disabled={loading}
          style={{ display: "none" }}
        />
        <span
          style={{
            display: "inline-block",
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            background: loading ? "#f1f5f9" : "white",
            fontSize: 14,
          }}
        >
          {loading ? "Subiendo..." : "Subir comprobante"}
        </span>
      </label>

      {msg ? <span style={{ fontSize: 12, color: "#334155" }}>{msg}</span> : null}
    </div>
  );
}
