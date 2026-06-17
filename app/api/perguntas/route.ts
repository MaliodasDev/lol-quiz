import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// Sempre busca dados frescos do banco (sem cache)
export const dynamic = "force-dynamic";

// GET /api/perguntas  →  devolve as perguntas guardadas no MongoDB
export async function GET() {
  try {
    const db = await getDb();
    const perguntas = await db
      .collection("perguntas")
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return NextResponse.json({ perguntas });
  } catch {
    return NextResponse.json({ erro: "Erro ao buscar perguntas." }, { status: 500 });
  }
}
