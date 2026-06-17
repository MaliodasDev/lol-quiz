"use client";

import { useState } from "react";

// ===== Tipos =====
type Pergunta = { q: string; opcoes: string[]; correta: number };
type LinhaRanking = { usuario: string; acertos: number; total: number };
type Aviso = { txt: string; tipo: "" | "erro" | "ok" };

const QTD_POR_PARTIDA = 10;

export default function Home() {
  // ----- Navegação e sessão -----
  const [tela, setTela] = useState<"login" | "menu" | "quiz" | "resultado" | "ranking">("login");
  const [usuario, setUsuario] = useState("");

  // ----- Login -----
  const [campoUser, setCampoUser] = useState("");
  const [campoSenha, setCampoSenha] = useState("");
  const [aviso, setAviso] = useState<Aviso>({ txt: "", tipo: "" });
  const [carregando, setCarregando] = useState(false);

  // ----- Quiz -----
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [escolhido, setEscolhido] = useState<number | null>(null);

  // ----- Ranking -----
  const [ranking, setRanking] = useState<LinhaRanking[]>([]);

  // ================= LOGIN E CADASTRO =================
  async function cadastrar() {
    setCarregando(true);
    setAviso({ txt: "", tipo: "" });
    try {
      const r = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: campoUser, senha: campoSenha }),
      });
      const dados = await r.json();
      if (!r.ok) setAviso({ txt: dados.erro, tipo: "erro" });
      else entrarNoMenu(dados.usuario);
    } catch {
      setAviso({ txt: "Falha de conexão.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  }

  async function entrar() {
    setCarregando(true);
    setAviso({ txt: "", tipo: "" });
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: campoUser, senha: campoSenha }),
      });
      const dados = await r.json();
      if (!r.ok) setAviso({ txt: dados.erro, tipo: "erro" });
      else entrarNoMenu(dados.usuario);
    } catch {
      setAviso({ txt: "Falha de conexão.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  }

  function entrarNoMenu(nome: string) {
    setUsuario(nome);
    setAviso({ txt: "", tipo: "" });
    setTela("menu");
  }

  function sair() {
    setUsuario("");
    setCampoSenha("");
    setAviso({ txt: "", tipo: "" });
    setTela("login");
  }

  // ================= QUIZ =================
  function embaralhar<T>(arr: T[]): T[] {
    const c = [...arr];
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
  }

  async function iniciarQuiz() {
    setCarregando(true);
    try {
      const r = await fetch("/api/perguntas");
      const dados = await r.json();
      const sorteadas = embaralhar(dados.perguntas as Pergunta[]).slice(0, QTD_POR_PARTIDA);
      setPerguntas(sorteadas);
      setIndice(0);
      setAcertos(0);
      setEscolhido(null);
      setTela("quiz");
    } catch {
      setAviso({ txt: "Não foi possível carregar as perguntas.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  }

  function responder(i: number) {
    if (escolhido !== null) return; // já respondeu esta pergunta
    setEscolhido(i);
    const acertou = i === perguntas[indice].correta;
    const novoTotal = acertou ? acertos + 1 : acertos;
    if (acertou) setAcertos(novoTotal);

    setTimeout(() => {
      if (indice + 1 < perguntas.length) {
        setIndice(indice + 1);
        setEscolhido(null);
      } else {
        finalizar(novoTotal);
      }
    }, 900);
  }

  async function finalizar(acertosFinais: number) {
    // grava a pontuação no banco
    try {
      await fetch("/api/pontuacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, acertos: acertosFinais, total: perguntas.length }),
      });
    } catch {
      /* se falhar a gravação, ainda mostramos o resultado */
    }
    setAcertos(acertosFinais);
    setTela("resultado");
  }

  function fraseFinal() {
    const p = acertos / (perguntas.length || 1);
    if (p === 1) return "Perfeito! Você é digno do Desafiante.";
    if (p >= 0.7) return "Muito bom! Rumo ao Diamante.";
    if (p >= 0.4) return "Nada mal, invocador. Continue treinando.";
    return "O Tutorial te espera. Bora treinar!";
  }

  // ================= RANKING =================
  async function abrirRanking() {
    setCarregando(true);
    try {
      const r = await fetch("/api/ranking");
      const dados = await r.json();
      setRanking(dados.ranking || []);
      setTela("ranking");
    } catch {
      setAviso({ txt: "Não foi possível carregar o ranking.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  }

  // ================= TELAS =================
  return (
    <div className="palco">
      <div className="conteudo">
        <div className="marca">
          <div className="selo">League of Legends</div>
          <h1>Quiz do Invocador</h1>
          <div className="linha" />
        </div>

        {/* ---------- LOGIN ---------- */}
        {tela === "login" && (
          <section className="surgir">
            <div className={`aviso ${aviso.tipo}`}>{aviso.txt}</div>
            <label htmlFor="user">Nome de invocador</label>
            <input
              id="user"
              type="text"
              maxLength={16}
              placeholder="Ex.: Faker"
              value={campoUser}
              onChange={(e) => setCampoUser(e.target.value)}
            />
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              maxLength={20}
              placeholder="••••••"
              value={campoSenha}
              onChange={(e) => setCampoSenha(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && entrar()}
            />
            <button className="btn btn-ouro" onClick={entrar} disabled={carregando}>
              {carregando ? "Aguarde..." : "Entrar"}
            </button>
            <button className="btn btn-vazio" onClick={cadastrar} disabled={carregando}>
              Criar conta
            </button>
          </section>
        )}

        {/* ---------- MENU ---------- */}
        {tela === "menu" && (
          <section className="surgir">
            <p className="ola">
              Bem-vindo de volta, <b>{usuario}</b>!
            </p>
            <button className="btn btn-ouro" onClick={iniciarQuiz} disabled={carregando}>
              {carregando ? "Carregando..." : "Jogar"}
            </button>
            <button className="btn btn-vazio" onClick={abrirRanking} disabled={carregando}>
              Ranking de hoje
            </button>
            <button className="btn btn-vazio" onClick={sair}>
              Sair
            </button>
          </section>
        )}

        {/* ---------- QUIZ ---------- */}
        {tela === "quiz" && perguntas.length > 0 && (
          <section className="surgir">
            <div className="barra-topo">
              <span>
                Pergunta {indice + 1}/{perguntas.length}
              </span>
              <span>Acertos: {acertos}</span>
            </div>
            <div className="progresso">
              <div style={{ width: `${(indice / perguntas.length) * 100}%` }} />
            </div>
            <p className="pergunta">{perguntas[indice].q}</p>
            <div>
              {perguntas[indice].opcoes.map((texto, i) => {
                let classe = "opcao";
                if (escolhido !== null) {
                  if (i === perguntas[indice].correta) classe += " certa";
                  else if (i === escolhido) classe += " errada";
                }
                return (
                  <button
                    key={i}
                    className={classe}
                    onClick={() => responder(i)}
                    disabled={escolhido !== null}
                  >
                    {texto}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------- RESULTADO ---------- */}
        {tela === "resultado" && (
          <section className="surgir placar">
            <div>
              <span className="nota">{acertos}</span>
              <span className="de">/{perguntas.length}</span>
            </div>
            <p className="frase">{fraseFinal()}</p>
            <button className="btn btn-ouro" onClick={abrirRanking} disabled={carregando}>
              Ver ranking
            </button>
            <button className="btn btn-vazio" onClick={() => setTela("menu")}>
              Voltar ao menu
            </button>
          </section>
        )}

        {/* ---------- RANKING ---------- */}
        {tela === "ranking" && (
          <section className="surgir">
            <h2 className="ranking-titulo">Ranking de hoje</h2>
            <p className="ranking-sub">Pontuações das últimas 24 horas</p>
            {ranking.length === 0 ? (
              <p className="vazio-ranking">Ninguém pontuou nas últimas 24 horas. Seja o primeiro!</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Invocador</th>
                    <th style={{ textAlign: "right" }}>Acertos</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((r, i) => (
                    <tr key={i}>
                      <td className="pos">{i + 1}º</td>
                      <td>{r.usuario}</td>
                      <td className="pts">
                        {r.acertos}/{r.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button className="btn btn-vazio" onClick={() => setTela("menu")}>
              Voltar ao menu
            </button>
          </section>
        )}

        <p className="rodape">Next.js + MongoDB Atlas — trabalho acadêmico</p>
      </div>
    </div>
  );
}
