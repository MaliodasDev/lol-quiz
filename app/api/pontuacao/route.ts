import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

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
      data: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[pontuacao]", err);
    return NextResponse.json({ erro: "Erro ao salvar pontuação." }, { status: 500 });
  }
}
