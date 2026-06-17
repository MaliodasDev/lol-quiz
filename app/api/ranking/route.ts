import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT usuario, acertos, total
      FROM (
        SELECT DISTINCT ON (usuario) usuario, acertos, total
        FROM ranking
        WHERE data >= NOW() - INTERVAL '24 hours'
        ORDER BY usuario, acertos DESC, data ASC
      ) best
      ORDER BY acertos DESC
      LIMIT 10
    `);
    return NextResponse.json({ ranking: result.rows });
  } catch (err) {
    console.error("[ranking]", err);
    return NextResponse.json({ erro: "Erro ao buscar ranking." }, { status: 500 });
  }
}
