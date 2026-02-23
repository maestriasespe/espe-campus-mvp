import { BrandBar } from "@/components/BrandBar";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <BrandBar title="Acceso alumnos" />
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <h1 className="text-xl font-semibold">Iniciar sesión</h1>
          <p className="text-sm text-slate-600 mt-1">Ingresa con tu matrícula y contraseña.</p>

          <form className="mt-6 space-y-4" method="post" action="/api/auth/login">
            <div>
              <label className="text-sm font-medium">Matrícula</label>
              <input
                name="matricula"
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="Ej. 800123"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input
                name="password"
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="********"
                required
              />
            </div>
            <button className="w-full rounded-xl bg-navy text-white py-2 font-semibold hover:opacity-95">
              Entrar
            </button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            ¿No tienes contraseña? Solicítala a control escolar.
          </div>
        </div>
      </div>
    </div>
  );
}
