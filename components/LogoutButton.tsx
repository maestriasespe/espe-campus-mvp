"use client";

export default function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="post">
      <button
        type="submit"
        className="rounded-lg border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100"
      >
        Cerrar sesión
      </button>
    </form>
  );
}