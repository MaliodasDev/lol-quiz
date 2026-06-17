import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// POST /api/pontuacao  →  grava o resultado de uma partida no ranking
export async function POST(req: Request) {
  try {
    const { usuario, acertos, total } = await req.json();
    if (!usuario)
      return NextResponse.json({ erro: "Usuário ausente." }, { status: 400 });

    const db = await getDb();
    await db.collection("ranking").insertOne({
      usuario,
      acertos: Number(acertos) || 0,
      total: Number(total) || 0,
      data: new Date(), // usado pelo índice TTL para expirar em 24h
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ erro: "Erro ao salvar pontuação." }, { status: 500 });
  }
}
