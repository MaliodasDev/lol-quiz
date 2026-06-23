import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const perguntas = await db
      .collection("perguntas")
      .find({}, { projection: { _id: 0, q: 1, opcoes: 1, correta: 1 } })
      .toArray();
    return NextResponse.json({ perguntas });
  } catch (err) {
    console.error("[perguntas]", err);
    return NextResponse.json({ erro: "Erro ao buscar perguntas." }, { status: 500 });
  }
}
