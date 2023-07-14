async function recebeAPI() {
  const conexao = await fetch(
    "https://64af422ac85640541d4e3c2f.mockapi.io/lista"
  );
  const listaApi = await conexao.json();
  return listaApi;
}

async function criaCard() {
  const dadosApi = await recebeAPI();

  function criarCard(nome, imagem, preco, descricao, regiao) {
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
          <p class="preco">${preco}</p>
        </div>
      </div>

      <div class="descricao display-none">
        <strong>Sobre mim</strong>
        <br><br>
        <p>${descricao}</p>
        <br>
        <strong>Região</strong>
        <br><br>
        <p>${regiao}</p>
        <br>
        <button class="botao_orcamento">Solicitar orçamento</button>
      </div>
    `;

    const imagemElement = card.querySelector(".imagem");
    const tituloElement = card.querySelector(".titulo");
    const descricaoElement = card.querySelector(".descricao");
    const botaoCurtir = card.querySelector(".botaoCurtir");
    const imgCurtir = card.querySelector(".imgCurtir");
    const precoElement = card.querySelector(".preco");

    let curtido = false;

    botaoCurtir.addEventListener("click", function () {
      toggleCurtir();
      sincronizarCurtir();
    });

    function toggleCurtir() {
      if (curtido) {
        imgCurtir.src = "assets/img/coracaobranco.svg";
        precoElement.textContent = (
          parseInt(precoElement.textContent) - 1
        ).toString();
        curtido = false;
      } else {
        imgCurtir.src = "assets/img/coracaovermelho.svg";
        precoElement.textContent = (
          parseInt(precoElement.textContent) + 1
        ).toString();
        curtido = true;
      }
    }

    function sincronizarCurtir() {
      const cardSelecionado = document.querySelector("#cardSelecionado .card");
      if (cardSelecionado) {
        const imgCurtirSelecionado =
          cardSelecionado.querySelector(".imgCurtir");
        const precoElementSelecionado = cardSelecionado.querySelector(".preco");

        imgCurtirSelecionado.src = imgCurtir.src;
        precoElementSelecionado.textContent = precoElement.textContent;
      }
    }

    return [
      card,
      imagemElement,
      tituloElement,
      descricaoElement,
      botaoCurtir,
      imgCurtir,
      precoElement,
    ];
  }

  return criarCard;
}

let lista = document.getElementById("listaAnimais");
let cardSelecionado = document.getElementById("cardSelecionado");
let tabsEscolher = document.querySelectorAll(".tabs__escolher button");

async function listaCards() {
  try {
    const criarCardFunction = await criaCard();
    const dadosLista = await recebeAPI();

    function filtrarLista(regiao) {
      if (regiao === "todos") {
        return dadosLista;
      } else {
        return dadosLista.filter((animal) => animal.regiao === regiao);
      }
    }

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
          precoElement,
        ] = criarCardFunction(
          elemento.nome,
          elemento.imagem,
          elemento.preco,
          elemento.descricao,
          elemento.regiao
        );

        lista.appendChild(card);

        imagemElement.addEventListener("click", function () {
          const cardSelecionadoClone = card.cloneNode(true);
          cardSelecionadoClone.classList.add("card-ativo");
          cardSelecionadoClone
            .querySelector(".descricao")
            .classList.remove("display-none");
          cardSelecionado.innerHTML = "";
          cardSelecionado.appendChild(cardSelecionadoClone);
          const sectionTodos = document.getElementById("sectionTodos");
          sectionTodos.style.display = "none";
          const header = document.querySelector("header");
          header.scrollIntoView({ behavior: "smooth", block: "start" });

          const botaoCurtirSelecionado =
            cardSelecionadoClone.querySelector(".botaoCurtir");
          botaoCurtirSelecionado.addEventListener("click", function () {
            botaoCurtir.click();
          });
        });

        const botaoOrcamento = card.querySelector(".botao_orcamento");
        botaoOrcamento.addEventListener("click", function () {
          // Lógica para o botão "Solicitar orçamento"
        });
      });
    }

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

    exibirListaFiltrada("todos");
  } catch (error) {
    lista.innerHTML = `<h2>Não foi possível carregar a lista</h2>`;
    console.error(error);
  }
}

listaCards();
