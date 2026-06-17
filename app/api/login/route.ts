import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

// POST /api/login  →  confere nome e senha
export async function POST(req: Request) {
  try {
    const { usuario, senha } = await req.json();
    const nome = (usuario || "").trim();

    const db = await getDb();
    const user = await db.collection("usuarios").findOne({ usuario: nome });
    if (!user)
      return NextResponse.json({ erro: "Invocador não encontrado. Crie uma conta." }, { status: 404 });

    const senhaCerta = await bcrypt.compare(senha || "", user.senha);
    if (!senhaCerta)
      return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });

    return NextResponse.json({ ok: true, usuario: user.usuario });
  } catch {
    return NextResponse.json({ erro: "Erro no servidor." }, { status: 500 });
  }
}
