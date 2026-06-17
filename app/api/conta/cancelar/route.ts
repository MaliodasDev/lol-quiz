import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

// POST /api/conta/cancelar  →  cancela a exclusão agendada
export async function POST(req: Request) {
  try {
    const { usuario, senha } = await req.json();
    const nome = (usuario || "").trim();

    const db = await getDb();

    const user = await db.collection("usuarios").findOne({ usuario: nome });
    if (!user)
      return NextResponse.json({ erro: "Invocador não encontrado." }, { status: 404 });

    const senhaCerta = await bcrypt.compare(senha || "", user.senha);
    if (!senhaCerta)
      return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });

    if (!user.deletarEm)
      return NextResponse.json({ erro: "Nenhuma exclusão agendada." }, { status: 400 });

    await db.collection("usuarios").updateOne(
      { usuario: nome },
      { $unset: { deletarEm: "" } }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ erro: "Erro no servidor." }, { status: 500 });
  }
}
