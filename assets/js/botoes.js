/* Menu lateral */
let botaoMenu = document.getElementById("checkbox-menu");
let menuLateral = document.getElementById("menuLateral");

botaoMenu.addEventListener("change", function () {
  if (this.checked) {
    menuLateral.classList.remove("menu__lateral");
    menuLateral.classList.add("menu__lateral-ativo");
  } else {
    menuLateral.classList.remove("menu__lateral-ativo");
    menuLateral.classList.add("menu__lateral");
  }
});

/* Menu lateral fim */

/* Ver mais */

const botaoVerMais = document.getElementById("botaoVerMais");

botaoVerMais.addEventListener("click", () => {
  let listaAnimais = document.getElementById("listaAnimais");
  listaAnimais.classList.toggle("lista__animais");
  listaAnimais.classList.toggle("lista__animais-expandida");
  let listaTodos = document.getElementById("listaTodos");
  listaTodos.classList.toggle("lista__todos");
  listaTodos.classList.toggle("lista__todos-expandida");
  if (botaoVerMais.innerHTML === "Ver mais") {
    botaoVerMais.innerHTML = "Ver menos";
  } else {
    botaoVerMais.innerHTML = "Ver mais";
  }
});

/* Ver mais fim */
