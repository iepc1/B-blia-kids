let progresso = JSON.parse(localStorage.getItem("progresso")) || {};
let pontos = parseInt(localStorage.getItem("pontos")) || 0;
let personagemAtual = localStorage.getItem("personagem") || "Noé";

let personagens = ["Noé","Davi","Moisés","Maria"];

let capitulos = [
  { nome: "Éden", fases: 20 },
  { nome: "Noé", fases: 30 },
  { nome: "Moisés", fases: 40 },
  { nome: "Davi", fases: 50 }
];

let perguntas = [
 { pergunta:"Quem construiu a arca?", op:["Noé","Moisés"], c:0 },
 { pergunta:"Quem abriu o mar?", op:["Moisés","Davi"], c:0 },
 { pergunta:"Quem venceu Golias?", op:["Davi","Pedro"], c:0 },
 { pergunta:"Jesus nasceu onde?", op:["Belém","Roma"], c:0 }
];

let faseAtual;
let quizAtual = [];
let indice = 0;
let tempo = 60;
let timer;

// MENU
function abrirTela(t){
 document.getElementById("mapa").style.display="none";
 document.getElementById("fase").classList.add("hidden");
 document.getElementById("biblia").classList.add("hidden");
 document.getElementById("manga").classList.add("hidden");

 if(t==="mapa") document.getElementById("mapa").style.display="flex";
 else document.getElementById(t).classList.remove("hidden");
}

// MAPA
function criarMapa(){
 let mapa=document.getElementById("mapa");
 mapa.innerHTML="";

 capitulos.forEach((cap,cIndex)=>{
  let h=document.createElement("h2");
  h.innerText=cap.nome;
  mapa.appendChild(h);

  for(let i=1;i<=cap.fases;i++){
   let btn=document.createElement("button");
   btn.className="fase-btn";
   btn.innerText=i;

   let chave=cIndex+"-"+i;

   let liberado=
    (cIndex===0&&i===1)||
    progresso[cIndex+"-"+(i-1)]||
    (i===1&&capituloLiberado(cIndex));

   if(liberado){
    btn.classList.add("liberado");
    btn.onclick=()=>iniciarQuiz(cIndex,i);
   } else btn.disabled=true;

   if(progresso[chave]) btn.classList.add("concluido");

   mapa.appendChild(btn);
  }
 });
}

function capituloLiberado(c){
 if(c===0) return true;
 let ant=capitulos[c-1];
 return progresso[(c-1)+"-"+ant.fases];
}

// QUIZ
function perguntasDoDia(){
 let hoje=new Date().toDateString();
 let salvo=JSON.parse(localStorage.getItem("quizDia"));

 if(salvo && salvo.data===hoje) return salvo.lista;

 let lista=[...perguntas].sort(()=>Math.random()-0.5).slice(0,3);

 localStorage.setItem("quizDia",JSON.stringify({data:hoje,lista}));
 return lista;
}

function iniciarQuiz(c,n){
 faseAtual=c+"-"+n;

 document.getElementById("mapa").style.display="none";
 document.getElementById("fase").classList.remove("hidden");

 quizAtual=perguntasDoDia();
 indice=0;

 iniciarTimer();
 mostrarPergunta();
}

function iniciarTimer(){
 tempo=60;
 document.getElementById("tempo").innerText=tempo;

 timer=setInterval(()=>{
  tempo--;
  document.getElementById("tempo").innerText=tempo;

  if(tempo<=0){
   clearInterval(timer);
   alert("Tempo acabou!");
   voltar();
  }
 },1000);
}

function mostrarPergunta(){
 let q=quizAtual[indice];
 document.getElementById("pergunta").innerText=q.pergunta;

 let div=document.getElementById("opcoes");
 div.innerHTML="";

 q.op.forEach((o,i)=>{
  let b=document.createElement("button");
  b.innerText=o;
  b.onclick=()=>responder(i);
  div.appendChild(b);
 });
}

function responder(r){
 let q=quizAtual[indice];

 if(r===q.c){
  pontos+=10;
 } else {
  alert("Errou!");
  clearInterval(timer);
  voltar();
  return;
 }

 indice++;

 if(indice>=quizAtual.length){
  progresso[faseAtual]=true;

  if(Math.random()<0.3){
   let novo=personagens[Math.floor(Math.random()*personagens.length)];
   personagemAtual=novo;
   alert("Novo personagem: "+novo);
  }

  salvar();
  clearInterval(timer);
  voltar();
 } else mostrarPergunta();
}

function voltar(){
 document.getElementById("fase").classList.add("hidden");
 document.getElementById("mapa").style.display="flex";
 criarMapa();
}

// MANGA
let paginaAtual=1;
let totalPaginas=50;

function atualizarPagina(){
 document.getElementById("paginaManga").src="manga/"+paginaAtual+".jpg";
 document.getElementById("numPagina").innerText=paginaAtual;
}

function proxima(){
 if(paginaAtual<totalPaginas){
  paginaAtual++;
  atualizarPagina();
 }
}

function anterior(){
 if(paginaAtual>1){
  paginaAtual--;
  atualizarPagina();
 }
}

// SALVAR
function salvar(){
 localStorage.setItem("progresso",JSON.stringify(progresso));
 localStorage.setItem("pontos",pontos);
 localStorage.setItem("personagem",personagemAtual);
}

// START
criarMapa();