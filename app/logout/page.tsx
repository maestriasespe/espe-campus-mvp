export default function LogoutPage() {
  return (
    <form action="/api/auth/logout" method="post" className="min-h-screen grid place-items-center">
      <button className="rounded-xl bg-navy text-white px-4 py-2">Cerrar sesión</button>
    </form>
  );
}
