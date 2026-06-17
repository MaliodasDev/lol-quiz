import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const PERGUNTAS = [
  // Mecânicas básicas
  { q: "Quantos jogadores formam um time no modo clássico (Summoner's Rift)?", opcoes: ["3","5","7","10"], correta: 1 },
  { q: "Qual estrutura você precisa destruir para vencer a partida?", opcoes: ["Inibidor","Torre","Nexus","Barão"], correta: 2 },
  { q: "Qual empresa desenvolveu o League of Legends?", opcoes: ["Blizzard","Riot Games","Valve","Epic Games"], correta: 1 },
  { q: "Qual recurso a maioria dos campeões gasta para usar habilidades?", opcoes: ["Energia","Mana","Fúria","Ouro"], correta: 1 },
  { q: "Qual tecla normalmente ativa a habilidade suprema (ultimate)?", opcoes: ["Q","W","E","R"], correta: 3 },
  { q: "Qual monstro neutro dá um buff que fortalece os minions e ajuda a empurrar as rotas?", opcoes: ["Dragão","Barão Nashor","Arauto do Vale","Krug"], correta: 1 },
  { q: "Qual é a função do campeão que protege o atirador na rota inferior?", opcoes: ["Caçador","Suporte","Mago","Lutador"], correta: 1 },
  { q: "Como se chama a moeda usada para comprar itens durante a partida?", opcoes: ["Essência Azul","Ouro","Riot Points","Pontos de Honra"], correta: 1 },
  { q: "Quantas rotas (lanes) principais existem no Summoner's Rift?", opcoes: ["1","2","3","4"], correta: 2 },
  { q: "O que acontece quando um campeão acumula experiência suficiente?", opcoes: ["Compra itens de graça","Sobe de nível","Revive na hora","Teleporta para a base"], correta: 1 },
  { q: "Qual é o nível máximo que um campeão pode alcançar durante a partida?", opcoes: ["6","11","18","30"], correta: 2 },
  { q: "Em qual região do mapa os 'junglers' passam a maior parte do tempo?", opcoes: ["Rota do meio","Rota superior","Selva","Rota inferior"], correta: 2 },
  // Objetivos e mapa
  { q: "Quantas torres existem em cada rota antes do inibidor?", opcoes: ["1","2","3","4"], correta: 1 },
  { q: "O que o Barão Nashor concede ao time que o mata?", opcoes: ["Buff de velocidade","Buff de empurrada para os minions","Escudo temporário","Ouro extra por abate"], correta: 1 },
  { q: "Qual objetivo fica no rio perto da rota superior e pode ser tomado pelo Arauto do Vale?", opcoes: ["Poço Dragão","Covil do Barão","Pedra do Arauto","Poço da Fivela"], correta: 1 },
  { q: "Qual é o nome do mini-mapa em que você pode ver os inimigos visíveis?", opcoes: ["Radar","Minimap","Visão de Névoa","Grade de Jogo"], correta: 1 },
  { q: "O que é 'cs' (ou 'farm') no League of Legends?", opcoes: ["Número de abates","Quantidade de minions eliminados","Pontos de controle","Nível do campeão"], correta: 1 },
  { q: "Qual estrutura, quando destruída, faz os minions aliados ficarem mais fortes?", opcoes: ["Torre","Nexus","Inibidor","Barão"], correta: 2 },
  { q: "Qual é o nome do buff vermelho que faz ataques básicos desacelerar o inimigo?", opcoes: ["Buff Azul","Buff Vermelho","Buff do Dragão","Buff do Arauto"], correta: 1 },
  { q: "Qual buff aumenta a regeneração de mana e reduz o cooldown das habilidades?", opcoes: ["Buff Vermelho","Buff Azul","Buff do Barão","Buff do Ancião"], correta: 1 },
  // Campeões — identidade e classe
  { q: "Qual campeão é conhecido como 'o Errante Imortal' e é um lutador tanque da rota superior?", opcoes: ["Darius","Garen","Mundo","Mordekaiser"], correta: 2 },
  { q: "Qual campeão é uma atirador que usa uma besta e tem a habilidade 'Net' para se reposicionar?", opcoes: ["Jinx","Caitlyn","Vayne","Miss Fortune"], correta: 1 },
  { q: "Qual campeão suporte tem a habilidade de prender inimigos com correntes de gelo?", opcoes: ["Lulu","Thresh","Leona","Lux"], correta: 1 },
  { q: "Qual campeão jungler é uma criatura Vazio que come inimigos para crescer de tamanho?", opcoes: ["Rek'Sai","Kha'Zix","Cho'Gath","Vel'Koz"], correta: 2 },
  { q: "Qual campeão é uma ninja sombria que usa shuriken e pode se tornar invisível?", opcoes: ["Akali","Zed","Talon","Katarina"], correta: 0 },
  { q: "Qual campeão é chamado de 'A Mão Noxiana' e usa um machado gigante na rota superior?", opcoes: ["Garen","Darius","Renekton","Jarvan IV"], correta: 1 },
  { q: "Qual campeão mago tem uma habilidade que congela inimigos em uma tempestade de gelo?", opcoes: ["Lissandra","Anivia","Syndra","Orianna"], correta: 0 },
  { q: "Qual campeão é um arqueiro que dispara flechas encantadas e vem de Ionia?", opcoes: ["Varus","Ashe","Kindred","Ezreal"], correta: 0 },
  { q: "Qual campeão suporte usa lanternas para puxar aliados e inimigos?", opcoes: ["Blitzcrank","Thresh","Nautilus","Leona"], correta: 1 },
  { q: "Qual campeão pode ativar sua ultimate para se transformar em um dragão?", opcoes: ["Shyvana","Aurelion Sol","Jayce","Gnar"], correta: 0 },
  { q: "Qual campeão é um cavaleiro de Demacia que ataca com espada e escudo e possui a habilidade 'Julgamento'?", opcoes: ["Jarvan IV","Garen","Xin Zhao","Pantheon"], correta: 1 },
  { q: "Qual campeão usa um relógio para pausar o tempo com sua ultimate 'Chronoshift'?", opcoes: ["Zilean","Ekko","Bard","Orianna"], correta: 0 },
  { q: "Qual campeão é um assassino que se teleporta entre sombras para abater inimigos?", opcoes: ["Talon","Zed","Fizz","Evelyn"], correta: 1 },
  { q: "Qual campeão tem uma habilidade passiva chamada 'Determinação' que o faz reviver após morrer?", opcoes: ["Aatrox","Tryndamere","Zilean","Kindred"], correta: 1 },
  { q: "Qual campeão jungler é um espírito da morte que cria portais para lugares já visitados?", opcoes: ["Nocturne","Hecarim","Skarner","Bard"], correta: 3 },
  // Habilidades e mecânicas de campeões
  { q: "Qual é o nome da ultimate de Ashe?", opcoes: ["Flecha Encantada","Flecha de Cristal","Rajada de Hawk","Flecha Glacial"], correta: 1 },
  { q: "Qual campeão pode usar a ultimate 'Cometa Espacial' para viajar pelo mapa?", opcoes: ["Aurelion Sol","Lux","Ezreal","Syndra"], correta: 0 },
  { q: "O que a habilidade 'Blitzcrank Q' (Punho de Foguete) faz?", opcoes: ["Empurra um inimigo para longe","Atrai um inimigo para perto","Atordoa todos em área","Salta em direção a um inimigo"], correta: 1 },
  { q: "Qual campeão pode copiar a aparência de um inimigo com sua ultimate?", opcoes: ["Neeko","Shaco","LeBlanc","Sylas"], correta: 0 },
  { q: "Qual campeão rouba a ultimate do inimigo com sua própria ultimate 'Absorção'?", opcoes: ["Sylas","Neeko","Mordekaiser","Viego"], correta: 0 },
  { q: "Qual campeão pode possuir o corpo de inimigos mortos com sua ultimate?", opcoes: ["Mordekaiser","Viego","Evelynn","Tahm Kench"], correta: 1 },
  // Lore e regiões
  { q: "De qual região vêm os campeões Garen e Lux?", opcoes: ["Noxus","Demacia","Freljord","Ionia"], correta: 1 },
  { q: "Qual região é conhecida pelo gelo eterno e guerreiros como Ashe e Tryndamere?", opcoes: ["Noxus","Demacia","Freljord","Piltover"], correta: 2 },
  { q: "Qual cidade-estado é famosa pela tecnologia e hextech, e abriga campeões como Jayce e Vi?", opcoes: ["Zaun","Piltover","Bilgewater","Ixtal"], correta: 1 },
  { q: "Qual campeão é o imperador imortal de Noxus, morto e ressuscitado?", opcoes: ["Swain","Darius","Sion","Mordekaiser"], correta: 2 },
  { q: "De qual região vem Yasuo, o samurai errante?", opcoes: ["Demacia","Noxus","Ionia","Freljord"], correta: 2 },
  // Itens e compras
  { q: "Qual item lendário aumenta o dano de habilidades e tem o passivo 'Devastação'?", opcoes: ["Chapéu de Rabadon","Lâmina do Rei Arruinado","Tempestade de Hextech","Foice do Anjo"], correta: 0 },
  { q: "Qual item permite teleportar para qualquer lugar do mapa quando ativado?", opcoes: ["Zhonya","Sceptro de Cristal","Sinal de Recall","Botas de Teleporte"], correta: 3 },
  { q: "Qual item coloca o campeão em 'stasis' dourada invulnerável por alguns segundos?", opcoes: ["Zhonya","GA (Anjo da Guarda)","Escudo de Sterak","QSS"], correta: 0 },
  { q: "Qual item remove efeitos de controle de grupo (CC) quando ativado?", opcoes: ["Zhonya","Manto de Mermer","QSS (Quebradora de Faixas de Mercúrio)","Escudo de Sterak"], correta: 2 },
  { q: "Qual item de selva permite que o jungler cause mais dano a monstros épicos?", opcoes: ["Smite","Item de Selva (Stalker's Blade)","Garra do Guardião","Talismã de Ascensão"], correta: 1 },
];

async function setup() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      usuario VARCHAR(16) UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW(),
      deletar_em TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS perguntas (
      id SERIAL PRIMARY KEY,
      q TEXT NOT NULL,
      opcoes JSONB NOT NULL,
      correta INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ranking (
      id SERIAL PRIMARY KEY,
      usuario VARCHAR(16) NOT NULL,
      acertos INTEGER NOT NULL,
      total INTEGER NOT NULL,
      data TIMESTAMP DEFAULT NOW()
    );
  `);

  const { rows } = await pool.query("SELECT COUNT(*) FROM perguntas");
  if (Number(rows[0].count) !== PERGUNTAS.length) {
    await pool.query("TRUNCATE TABLE perguntas RESTART IDENTITY");
    for (const p of PERGUNTAS) {
      await pool.query(
        "INSERT INTO perguntas (q, opcoes, correta) VALUES ($1, $2, $3)",
        [p.q, JSON.stringify(p.opcoes), p.correta]
      );
    }
  }
}

setup().catch(console.error);

export default pool;
