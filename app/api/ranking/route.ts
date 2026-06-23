import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const ranking = await db
      .collection("ranking")
      .aggregate([
        { $match: { data: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } },
        { $sort: { acertos: -1, data: 1 } },
        {
          $group: {
            _id: "$usuario",
            usuario: { $first: "$usuario" },
            acertos: { $first: "$acertos" },
            total: { $first: "$total" },
          },
        },
        { $sort: { acertos: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, usuario: 1, acertos: 1, total: 1 } },
      ])
      .toArray();

    return NextResponse.json({ ranking });
  } catch (err) {
    console.error("[ranking]", err);
    return NextResponse.json({ erro: "Erro ao buscar ranking." }, { status: 500 });
  }
}
