"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ChangePasswordPage() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage("Contraseña actualizada correctamente.");
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="rounded-2xl border p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Cambiar contraseña</h1>
        <p className="text-sm text-gray-600 mb-6">
          Actualiza la contraseña de tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none"
              placeholder="********"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmar nueva contraseña</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black text-white px-4 py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}
      </div>
    </div>
  );
}