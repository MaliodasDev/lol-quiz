import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { usuario, senha } = await req.json();
    const nome = (usuario || "").trim();

    if (nome.length < 2)
      return NextResponse.json({ erro: "O nome precisa ter ao menos 2 letras." }, { status: 400 });
    if (!senha || senha.length < 3)
      return NextResponse.json({ erro: "A senha precisa ter ao menos 3 caracteres." }, { status: 400 });

    const existe = await pool.query("SELECT 1 FROM usuarios WHERE usuario = $1", [nome]);
    if (existe.rows.length > 0)
      return NextResponse.json({ erro: "Esse invocador já existe. Tente entrar." }, { status: 409 });

    const hash = await bcrypt.hash(senha, 10);
    await pool.query("INSERT INTO usuarios (usuario, senha) VALUES ($1, $2)", [nome, hash]);

    return NextResponse.json({ ok: true, usuario: nome });
  } catch (err) {
    console.error("[cadastro]", err);
    return NextResponse.json({ erro: "Erro no servidor." }, { status: 500 });
  }
}
