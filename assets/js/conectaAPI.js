// Função assíncrona para receber dados da API
async function recebeAPI() {
  const conexao = await fetch(
    "https://64af422ac85640541d4e3c2f.mockapi.io/lista"
  );
  const listaApi = await conexao.json();
  return listaApi;
}

// Função assíncrona para criar o card
async function criaCard() {
  const dadosApi = await recebeAPI();

  // Função para criar um card
  function criarCard(nome, imagem, curtidas, descricao, regiao) {
    const card = document.createElement("li");
    card.className = "card";
    card.innerHTML = `
      <div>
        <img class="imagem" src="${imagem}">
      </div>

      <div class="card__nome__container">
        <p class="titulo">${nome}</p>
        <div class="card__botaoCurtir">
          <button class="botaoCurtir"><img class="imgCurtir" src="assets/img/coracaobranco.svg" alt="botao curtir"></button>
          <p class="curtidas">${curtidas} curtidas</p>
        </div>
      </div>

      <div class="descricao">
        <strong>SOBRE MIM</strong>
        
        <p>${descricao}</p>
        
        <strong>REGIÃO</strong>
        
        <p class="regiao">${regiao}</p>
        
        <button class="cardSelecionado__botaoOrcamento" id="botaoOrcamento">Solicitar orçamento</button>
        <button class="cardSelecionado__botaoVoltar" id="botaoVoltar">Voltar</button>
      </div>
    `;

    const imagemElement = card.querySelector(".imagem");
    const tituloElement = card.querySelector(".titulo");
    const descricaoElement = card.querySelector(".descricao");
    const botaoCurtir = card.querySelector(".botaoCurtir");
    const imgCurtir = card.querySelector(".imgCurtir");
    const curtidasElement = card.querySelector(".card__botaoCurtir p.curtidas");

    let curtido = false;

    // Função para alternar o estado de curtida do card
    botaoCurtir.addEventListener("click", function () {
      toggleCurtir();
      sincronizarCurtir();
    });

    function toggleCurtir() {
      if (curtido) {
        imgCurtir.src = "assets/img/coracaobranco.svg";
        curtidasElement.textContent =
          (parseInt(curtidasElement.textContent) - 1).toString() + " curtidas";
        curtido = false;
      } else {
        imgCurtir.src = "assets/img/coracaovermelho.svg";
        curtidasElement.textContent =
          (parseInt(curtidasElement.textContent) + 1).toString() + " curtidas";
        curtido = true;
      }
    }

    // Função para sincronizar o estado de curtida com o card selecionado
    function sincronizarCurtir() {
      const cardSelecionado = document.querySelector("#cardSelecionado .card");
      if (cardSelecionado) {
        const imgCurtirSelecionado =
          cardSelecionado.querySelector(".imgCurtir");
        const curtidasElementSelecionado = cardSelecionado.querySelector(
          ".card__botaoCurtir .curtidas"
        );

        imgCurtirSelecionado.src = imgCurtir.src;
        curtidasElementSelecionado.textContent = curtidasElement.textContent;
      }
    }

    return [
      card,
      imagemElement,
      tituloElement,
      descricaoElement,
      botaoCurtir,
      imgCurtir,
      curtidasElement,
    ];
  }

  return criarCard;
}

// Elemento do DOM
let lista = document.getElementById("listaAnimais");
let cardSelecionado = document.getElementById("cardSelecionado");
let tabsEscolher = document.querySelectorAll(".tabs__escolher button");

// Variável para armazenar a posição do scroll
let scrollPosicao = 0;

// Função para exibir a lista de cards
async function listaCards() {
  try {
    const criarCardFunction = await criaCard();
    const dadosLista = await recebeAPI();

    // Função para filtrar a lista de acordo com a região selecionada
    function filtrarLista(regiao) {
      if (regiao === "todos") {
        return dadosLista;
      } else {
        return dadosLista.filter((animal) => animal.regiao === regiao);
      }
    }

    // Função para exibir a lista filtrada
    function exibirListaFiltrada(regiao) {
      lista.innerHTML = "";

      const listaFiltrada = filtrarLista(regiao);

      listaFiltrada.forEach((elemento) => {
        const [
          card,
          imagemElement,
          tituloElement,
          descricaoElement,
          botaoCurtir,
          imgCurtir,
          curtidasElement,
        ] = criarCardFunction(
          elemento.nome,
          elemento.imagem,
          elemento.curtidas,
          elemento.descricao,
          elemento.regiao
        );

        lista.appendChild(card);

        // Evento de clique na imagem do card
        imagemElement.addEventListener("click", function () {
          // Armazena a posição atual do scroll
          scrollPosicao = window.scrollY;

          const cardSelecionadoClone = card.cloneNode(true);
          cardSelecionadoClone.classList.add("card-ativo");
          const descricaoSelecionada =
            cardSelecionadoClone.querySelector(".descricao");
          descricaoSelecionada.style.display = "flex";

          cardSelecionado.innerHTML = "";
          cardSelecionado.appendChild(cardSelecionadoClone);
          cardSelecionado.style.display = "flex";
          const sectionTodos = document.getElementById("sectionTodos");
          sectionTodos.style.display = "none";
          const header = document.querySelector("header");
          header.scrollIntoView({ behavior: "smooth", block: "start" });

          const botaoCurtirSelecionado =
            cardSelecionadoClone.querySelector(".botaoCurtir");
          botaoCurtirSelecionado.addEventListener("click", function () {
            botaoCurtir.click();
          });

          const botaoVoltar = cardSelecionadoClone.querySelector(
            ".cardSelecionado__botaoVoltar"
          );
          botaoVoltar.addEventListener("click", function () {
            cardSelecionado.innerHTML = "";
            sectionTodos.style.display = "flex";
            window.scrollTo(0, scrollPosicao);
          });
        });

        const botaoOrcamento = card.querySelector(
          ".cardSelecionado__botaoOrcamento"
        );
        botaoOrcamento.addEventListener("click", function () {
          // Lógica para o botão "Solicitar orçamento"
        });
      });
    }

    // Eventos de clique nas abas
    tabsEscolher.forEach((tab) => {
      tab.addEventListener("click", function () {
        tabsEscolher.forEach((tab) => {
          tab.classList.remove("tab-selecionada");
        });
        this.classList.add("tab-selecionada");

        const regiaoSelecionada = this.id
          .replace("botaoEscolher", "")
          .toLowerCase();
        exibirListaFiltrada(regiaoSelecionada);
      });
    });

    // Definir a aba "Todos" como selecionada por padrão
    tabsEscolher[0].classList.add("tab-selecionada");

    exibirListaFiltrada("todos");
  } catch (error) {
    lista.innerHTML = `<h2>Não foi possível carregar a lista</h2>`;
    console.error(error);
  }
}

// Chamada da função para exibir a lista de cards
listaCards();
