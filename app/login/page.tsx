import { BrandBar } from "@/components/BrandBar";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <BrandBar title="Acceso alumnos" />

      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          
          <h1 className="text-2xl font-semibold text-slate-800">
            Iniciar sesión
          </h1>

          <p className="text-sm text-slate-600 mt-1">
            Ingresa con tu matrícula y contraseña.
          </p>

          <form
            className="mt-6 space-y-4"
            method="post"
            action="/api/auth/login"
          >
            {/* MATRÍCULA */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Matrícula
              </label>

              <input
                type="text"
                name="matricula"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="Ej. 800123 o ALU8001"
                required
              />
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Contraseña
              </label>

              <input
                type="password"
                name="password"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
                placeholder="********"
                required
              />
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              className="w-full rounded-xl bg-navy text-white py-2 font-semibold hover:opacity-95 transition"
            >
              Entrar
            </button>
          </form>

          <div className="mt-4 text-xs text-slate-500 text-center">
            ¿No tienes contraseña? Solicítala a control escolar.
          </div>
        </div>
      </div>
    </div>
  );
}
