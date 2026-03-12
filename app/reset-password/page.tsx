import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

type ResetPasswordPageProps = {
  searchParams?: {
    token?: string;
  };
};

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = searchParams?.token ?? "";

  return (
    <Suspense fallback={null}>
      <ResetPasswordClient token={token} />
    </Suspense>
  );
}

