async function recebeAPI() {
  const conexao = await fetch(
    "https://64af422ac85640541d4e3c2f.mockapi.io/lista"
  );
  const listaApi = await conexao.json();
  return listaApi;
}

async function criaCard() {
  const dadosApi = await recebeAPI();

  function criarCard(nome, imagem, preco) {
    const card = document.createElement("li");
    card.className = "card";
    card.innerHTML = `
      <img class="imagem" src="${imagem}">
      <p class="titulo">${nome}</p>
      <p class="preco">R$ ${preco}</p>
    `;

    return card;
  }

  return criarCard;
}

let lista = document.getElementById("listaTodos");

async function listaCards() {
  try {
    const criarCard = await criaCard();
    const dadosLista = await recebeAPI();

    dadosLista.forEach((elemento) =>
      lista.appendChild(
        criarCard(elemento.nome, elemento.imagem, elemento.preco)
      )
    );
  } catch (error) {
    lista.innerHTML = `<h2>Não foi possível carregar a lista</h2>`;
    console.error(error);
  }
}

listaCards();
