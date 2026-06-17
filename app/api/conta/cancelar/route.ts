import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { usuario, senha } = await req.json();
    const nome = (usuario || "").trim();

    const result = await pool.query(
      "SELECT senha, deletar_em FROM usuarios WHERE usuario = $1",
      [nome]
    );
    if (result.rows.length === 0)
      return NextResponse.json({ erro: "Invocador não encontrado." }, { status: 404 });

    const user = result.rows[0];
    const senhaCerta = await bcrypt.compare(senha || "", user.senha);
    if (!senhaCerta)
      return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });

    if (!user.deletar_em)
      return NextResponse.json({ erro: "Nenhuma exclusão agendada." }, { status: 400 });

    await pool.query("UPDATE usuarios SET deletar_em = NULL WHERE usuario = $1", [nome]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[conta/cancelar]", err);
    return NextResponse.json({ erro: "Erro no servidor." }, { status: 500 });
  }
}
