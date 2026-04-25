let moedas = 0;
let progresso = {};

let capitulos = [
  { nome: "Éden", fases: 20 },
  { nome: "Noé", fases: 30 },
  { nome: "Moisés", fases: 40 },
  { nome: "Davi", fases: 50 }
];

let perguntas = [
  { p: "Quem construiu a arca?", r: "noé" },
  { p: "Quem abriu o mar?", r: "moisés" },
  { p: "Quem venceu Golias?", r: "davi" }
];

function mostrarTela(t) {
  document.querySelectorAll(".tela").forEach(x => x.classList.add("hidden"));
  document.getElementById(t).classList.remove("hidden");
}

function abrirMapa() {
  mostrarTela("mapa");
  let mapa = document.getElementById("mapa");
  mapa.innerHTML = "";

  capitulos.forEach((cap, c) => {
    let titulo = document.createElement("h3");
    titulo.innerText = cap.nome;
    mapa.appendChild(titulo);

    for (let i = 1; i <= cap.fases; i++) {
      let btn = document.createElement("button");
      btn.innerText = i;
      btn.className = "fase-btn";

      if (i === 1 || progresso[c + "-" + (i - 1)]) {
        btn.onclick = () => abrirFase(c, i);
      } else {
        btn.disabled = true;
      }

      mapa.appendChild(btn);
    }
  });
}

let faseAtual;
let tempo;
let timer;

function abrirFase(c, n) {
  faseAtual = c + "-" + n;
  mostrarTela("fase");

  let q = perguntas[Math.floor(Math.random() * perguntas.length)];

  document.getElementById("tituloFase").innerText =
    capitulos[c].nome + " - " + n;

  document.getElementById("pergunta").innerText = q.p;
  document.getElementById("resposta").dataset.r = q.r;

  iniciarTempo();
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
      alert("Tempo acabou");
      mostrarTela("home");
    }
  }, 1000);
}

function responder() {
  let user = document.getElementById("resposta").value.toLowerCase();
  let r = document.getElementById("resposta").dataset.r;

  if (user === r) {
    alert("Acertou!");
    progresso[faseAtual] = true;
    moedas += 10;
    document.getElementById("moedas").innerText = moedas;
  } else {
    alert("Errou!");
  }

  mostrarTela("mapa");
}
