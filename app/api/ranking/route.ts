import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// GET /api/ranking  →  melhor pontuação de cada jogador nas últimas 24 horas
export async function GET() {
  try {
    const db = await getDb();
    const limite = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h atrás

    const ranking = await db
      .collection("ranking")
      .aggregate([
        // só partidas das últimas 24 horas
        { $match: { data: { $gte: limite } } },
        // ordena por acerto (e, em empate, quem fez primeiro)
        { $sort: { acertos: -1, data: 1 } },
        // pega a melhor pontuação de cada jogador
        {
          $group: {
            _id: "$usuario",
            acertos: { $first: "$acertos" },
            total: { $first: "$total" },
          },
        },
        // ordena o ranking final e limita ao top 10
        { $sort: { acertos: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, usuario: "$_id", acertos: 1, total: 1 } },
      ])
      .toArray();

    return NextResponse.json({ ranking });
  } catch {
    return NextResponse.json({ erro: "Erro ao buscar ranking." }, { status: 500 });
  }
}
