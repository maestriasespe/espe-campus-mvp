"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 10) return alert("La contrase�a debe tener al menos 10 caracteres.");
    if (password !== password2) return alert("Las contrase�as no coinciden.");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) return alert(error.message);
    setPassword("");
    setPassword2("");
    alert("Contrase�a actualizada ?");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-espe-muted mb-1">
          Nueva contrase�a
        </label>
        <input
          type="password"
          className="w-full rounded-xl2 border border-espe-line bg-espe-surface px-3 py-2 text-espe-text outline-none focus:ring-2 focus:ring-espe-gold/30"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="**********"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-espe-muted mb-1">
          Confirmar nueva contrase�a
        </label>
        <input
          type="password"
          className="w-full rounded-xl2 border border-espe-line bg-espe-surface px-3 py-2 text-espe-text outline-none focus:ring-2 focus:ring-espe-gold/30"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          autoComplete="new-password"
          placeholder="**********"
        />
      </div>

      <button
        disabled={loading}
        className="rounded-xl2 border border-espe-gold bg-espe-gold/20 px-4 py-2 text-sm font-bold text-espe-text hover:bg-espe-gold/30 disabled:opacity-60"
        type="submit"
      >
        {loading ? "Actualizando..." : "Actualizar contrase�a"}
      </button>
    </form>
  );
}

