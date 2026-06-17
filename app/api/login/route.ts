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
      return NextResponse.json({ erro: "Invocador não encontrado. Crie uma conta." }, { status: 404 });

    const user = result.rows[0];

    if (user.deletar_em && new Date(user.deletar_em) <= new Date()) {
      await pool.query("DELETE FROM usuarios WHERE usuario = $1", [nome]);
      return NextResponse.json({ erro: "Conta excluída." }, { status: 404 });
    }

    const senhaCerta = await bcrypt.compare(senha || "", user.senha);
    if (!senhaCerta)
      return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });

    return NextResponse.json({ ok: true, usuario: nome });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ erro: "Erro no servidor." }, { status: 500 });
  }
}
