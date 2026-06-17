import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { usuario, acertos, total } = await req.json();
    if (!usuario)
      return NextResponse.json({ erro: "Usuário ausente." }, { status: 400 });

    await pool.query(
      "INSERT INTO ranking (usuario, acertos, total) VALUES ($1, $2, $3)",
      [usuario, Number(acertos) || 0, Number(total) || 0]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[pontuacao]", err);
    return NextResponse.json({ erro: "Erro ao salvar pontuação." }, { status: 500 });
  }
}
