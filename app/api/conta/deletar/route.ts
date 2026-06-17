import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { usuario, senha } = await req.json();
    const nome = (usuario || "").trim();

    const result = await pool.query("SELECT senha FROM usuarios WHERE usuario = $1", [nome]);
    if (result.rows.length === 0)
      return NextResponse.json({ erro: "Invocador não encontrado." }, { status: 404 });

    const senhaCerta = await bcrypt.compare(senha || "", result.rows[0].senha);
    if (!senhaCerta)
      return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });

    const deletarEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query("UPDATE usuarios SET deletar_em = $1 WHERE usuario = $2", [deletarEm, nome]);

    return NextResponse.json({ ok: true, deletarEm });
  } catch (err) {
    console.error("[conta/deletar]", err);
    return NextResponse.json({ erro: "Erro no servidor." }, { status: 500 });
  }
}
