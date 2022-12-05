window.addEventListener("load", function() {
    if (document.firstElementChild.getAttribute("page") == "Productos") {
      loadProducts();
    }
})

const URL = "http://localhost:3000";
// const URL = "https://anxious-shoe-toad.cyclic.app";

function loadProducts(){

  console.log(URL);
  let xhr = new XMLHttpRequest();

  xhr.open('GET', URL + "/api/products");
  xhr.setRequestHeader('Content-Type','application/json');

  xhr.send();

  xhr.onload = function () {
    if (xhr.status != 200) { 
      
      cuentaDisplay.innerHTML = "<img src=\"/ProyectoFinal/Frontend/Styles/angai313-spongebob-sad.gif\" alt=\"sdf\">"
        
    } else {

      console.log(xhr.response);
      ProductListToHTML(JSON.parse(xhr.response));
      console.log(JSON.parse(xhr.response))
          
    }
    
  }

}

function addToCart(Id) {
  let StrT = "" + localStorage.token;
  let xhr = new XMLHttpRequest();
  console.log(Id);

  xhr.open('PUT', URL + "/api/cart/" + StrT);
  xhr.setRequestHeader('Content-Type','application/json');

  let info = {
    idProducto: Id
  }

  xhr.send([JSON.stringify(info)]);

  xhr.onload = function () {
    if (xhr.status != 200) { 
      
      alert(xhr.status);
      console.log("Error")
        
    } else {

      console.log("Agregado al carrito")
          
    }
  }
}

function ProductToHTML(Product) {
    return "<div class=\"col-sm-4 col-md-3\" sstyle=\"min-height: 80px ;\">" +
    "<div class=\"thumbnail\" style=\"margin:10px;  border:10px solid #ddd;background-color:#fff; width:330px;\">" +
      "<h4 class=\"text-center\"><span class=\"label label-info\">" + Product.Categoría + "</span></h4>" +
      "<img src=\"" + Product.Imagen + "\" class=\"img-responsive\">" +
      "<div class=\"caption\">" +
        "<div class=\"row\">" +
          "<div class=\"col-md-6 col-xs-6\">" +
            "<h3>" + Product.Tipo + "</h3>" +
          "</div>" +
          "<div class=\"col-md-7 col-xs-6 price\">" +
          "</div>" +
        "</div>" +
        "<h4>Presentacion: " + Product.Presentación  + "</h4>" +
       "<p></p>" +
        "<div class=\"row\">" +
          "<div class=\"col-md-6\">" +
            "<button onclick=\"addToCart("+Product.Id+")\"  type=\"button\" class=\"btn btn-primary m-2\" data-toggle=\"modal\" data-target=\"#ModalInfo\">" +
            "Agregar al carrito" +
            "</button>" +
          "</div>" +
        "</div>" +

        "<p> </p>" +
      "</div>" +
    "</div>" +
  "</div>"
}

function ProductListToHTML(ProductList) {
    
  let Str = ProductList.map(ProductToHTML);
  listaProductos.innerHTML = Str;
}

function fProducts(){
  let xhr = new XMLHttpRequest();

  xhr.open('GET', URL + "/api/products/" + document.getElementById("searchBar").value);
  xhr.setRequestHeader('Content-Type','application/json');

  xhr.send();

  xhr.onload = function () {
    if (xhr.status != 200) { 
      
      cuentaDisplay.innerHTML = "<img src=\"/ProyectoFinal/Frontend/Styles/angai313-spongebob-sad.gif\" alt=\"sdf\">"
        
    } else {

      ProductListToHTML(JSON.parse(xhr.response));
      console.log(JSON.parse(xhr.response))
          
    }
    
}
}
