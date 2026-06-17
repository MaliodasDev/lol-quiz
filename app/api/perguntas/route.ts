import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await pool.query("SELECT q, opcoes, correta FROM perguntas ORDER BY id");
    return NextResponse.json({ perguntas: result.rows });
  } catch (err) {
    console.error("[perguntas]", err);
    return NextResponse.json({ erro: "Erro ao buscar perguntas." }, { status: 500 });
  }
}
