import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const { data, error } = await resend.emails.send({
    from: "ESPE Campus <soporte@espe.edu.mx>",
    to: "pacgus.gs@gmail.com",
    subject: "Prueba correo ESPE",
    html: "<strong>Si ves este correo, Resend funciona.</strong>",
  });

  return NextResponse.json({ data, error });
}