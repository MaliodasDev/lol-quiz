import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

// POST /api/conta/deletar  →  agenda exclusão da conta em 7 dias
export async function POST(req: Request) {
  try {
    const { usuario, senha } = await req.json();
    const nome = (usuario || "").trim();

    const db = await getDb();

    // Cria o TTL index uma vez (idempotente — MongoDB ignora se já existir)
    await db.collection("usuarios").createIndex(
      { deletarEm: 1 },
      { expireAfterSeconds: 0, sparse: true }
    );

    const user = await db.collection("usuarios").findOne({ usuario: nome });
    if (!user)
      return NextResponse.json({ erro: "Invocador não encontrado." }, { status: 404 });

    const senhaCerta = await bcrypt.compare(senha || "", user.senha);
    if (!senhaCerta)
      return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });

    const deletarEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 dias

    await db.collection("usuarios").updateOne(
      { usuario: nome },
      { $set: { deletarEm } }
    );

    return NextResponse.json({ ok: true, deletarEm });
  } catch {
    return NextResponse.json({ erro: "Erro no servidor." }, { status: 500 });
  }
}
