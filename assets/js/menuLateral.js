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
