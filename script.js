let progresso = JSON.parse(localStorage.getItem("progresso")) || {};
let moedas = parseInt(localStorage.getItem("moedas")) || 0;

let capitulos = [
  { nome: "Éden", fases: 20 },
  { nome: "Noé", fases: 30 },
  { nome: "Moisés", fases: 40 },
  { nome: "Davi", fases: 50 }
];

let perguntas = [
  { p: "Quem construiu a arca?", r: "Noé" },
  { p: "Quem abriu o mar?", r: "Moisés" },
  { p: "Quem derrotou Golias?", r: "Davi" },
  { p: "Quem foi jogado na cova dos leões?", r: "Daniel" }
];

let faseAtual = null;
let tempo = 60;
let timer;

document.getElementById("moedas").innerText = moedas;

function mostrarTela(tela) {
  document.querySelectorAll(".tela").forEach(t => t.classList.add("hidden"));
  document.getElementById(tela).classList.remove("hidden");
}

function abrirMapa() {
  mostrarTela("mapa");
  criarMapa();
}

function criarMapa() {
  let mapa = document.getElementById("mapa");
  mapa.innerHTML = "";

  capitulos.forEach((cap, cIndex) => {
    let titulo = document.createElement("h3");
    titulo.innerText = "Capítulo: " + cap.nome;
    mapa.appendChild(titulo);

    for (let i = 1; i <= cap.fases; i++) {
      let btn = document.createElement("button");
      btn.innerText = i;
      btn.className = "fase-btn";

      let chave = cIndex + "-" + i;

      if (i === 1 || progresso[cIndex + "-" + (i - 1)]) {
        btn.onclick = () => abrirFase(cIndex, i);
      } else {
        btn.disabled = true;
      }

      mapa.appendChild(btn);
    }
  });
}

function abrirFase(cap, num) {
  faseAtual = cap + "-" + num;
  mostrarTela("fase");

  document.getElementById("tituloFase").innerText =
    capitulos[cap].nome + " - Fase " + num;

  novaPergunta();
  iniciarTempo();
}

function novaPergunta() {
  let q = perguntas[Math.floor(Math.random() * perguntas.length)];
  document.getElementById("pergunta").innerText = q.p;
  document.getElementById("resposta").value = "";
  document.getElementById("resposta").dataset.correta = q.r;
}

function iniciarTempo() {
  tempo = 60;
  document.getElementById("tempo").innerText = tempo;

  clearInterval(timer);
  timer = setInterval(() => {
    tempo--;
    document.getElementById("tempo").innerText = tempo;

    if (tempo <= 0) {
      clearInterval(timer);
      alert("⏱️ Tempo acabou!");
      abrirMapa();
    }
  }, 1000);
}

function responder() {
  let user = document.getElementById("resposta").value.toLowerCase();
  let correta = document.getElementById("resposta").dataset.correta.toLowerCase();

  if (user === correta) {
    alert("⭐ Acertou!");
    progresso[faseAtual] = true;
    moedas += 10;

    localStorage.setItem("moedas", moedas);
    localStorage.setItem("progresso", JSON.stringify(progresso));
  } else {
    alert("❌ Errou!");
  }

  clearInterval(timer);
  document.getElementById("moedas").innerText = moedas;
  abrirMapa();
      }
