import { Card } from "@/components/Card";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { requireRole } from "@/lib/require-session";

export default async function StudentSettingsPage() {
  await requireRole("student");

  return (
    <Card title="Seguridad">
      <div className="space-y-4">
        <p className="text-sm text-espe-muted">
          Cambia tu contrase�a. Te recomendamos m�nimo 10 caracteres.
        </p>
        <ChangePasswordForm />
      </div>
    </Card>
  );
}

