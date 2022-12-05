window.addEventListener("load", function() {
  if (document.firstElementChild.getAttribute("page") == "Cuenta") {
    loadUser();
  }
})

// const URL = "http://localhost:3000";
const URL = "https://anxious-shoe-toad.cyclic.app";

function registerFuction() {
  let email = document.getElementById("CorreoRegister").value;
  let pass = document.getElementById("PasswordRegister").value;
  let name = document.getElementById("NombreRegister").value;
  let lastName = document.getElementById("ApellidoRegister").value;
  let passConfirm = document.getElementById("PasswordConfirmRegister").value;
  let number = document.getElementById("NumberRegister").value;
  let sex;

  if (pass != passConfirm) {
    alert("Conraseñas no coinciden");
    return;
  }
  document.getElementsByName("Test").forEach(element => {
    if (element.checked) {
      sex = element.value;
    }
  });

  let info = {
    nombre: name,
    apellidos: lastName,
    correo: email,
    contraseña: pass,
    numero: number,
    sexo: sex
  }

  let xhr = new XMLHttpRequest();

  xhr.open('POST', URL + "/api/users");

  xhr.setRequestHeader('Content-Type', 'application/json');
  // xhr.setRequestHeader('x-auth-user', localStorage.token);

  xhr.send([JSON.stringify(info)]);

  xhr.onload = function () {
    if (xhr.status != 201) { 
        
      alert(xhr.response);
        
    } else {
      document.getElementById("FormRegister").reset();
      $('#Register').modal('hide');
      console.log("Register fuction termino");
      alert("Usuario agregado!!");
        
    }
};

}

function loginFuction() {
  let email = document.getElementById("emailLogin").value;
  let pass = document.getElementById("passwordLogin").value;


  let info = {"Email": email, "Password": pass};

  let xhr = new XMLHttpRequest();

  xhr.open('POST', URL + "/api/login");

  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send([JSON.stringify(info)]);

  xhr.onload = function () {
      if (xhr.status != 200) { 
         
        alert(xhr.response);
          
      } else {

        localStorage.token = xhr.response;
        document.getElementById("FormLogin").reset();
        $('#LogIn').modal('hide');
        alert("Sesión iniciada");
        window.location.href = "Cuenta.html";
          
      }
  };
}

function loadModalEdit(Boton) {
  let id = Boton.getAttribute("saveID");
  let xhr = new XMLHttpRequest();

  xhr.open('GET', "http://localhost:3000/api/users/" + id);

  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send();
  
  xhr.onload = function () {
      if (xhr.status != 200) { 
      
          alert("Error con el get");
          
      } else {
          
          let user = JSON.parse(xhr.response);
          let Str = "<form id=\"formEdit\"action=\"javascript: editFuction()\">" +
                
          "<input type=\"text\" name=\"\" id=\"NombreRegister\" class=\"form-control\" placeholder=\"Nombre\" aria-describedby=\"helpId\""+
          "maxlength=\"10\" required> <br>" +

          "<input type=\"text\" name=\"\" id=\"ApellidoRegister\" class=\"form-control\" placeholder=\"Apellido\" aria-describedby=\"helpId\" " +
          "maxlength=\"10\" required> <br>" +

          "<input type=\"password\" name=\"\" id=\"PasswordRegister\" class=\"form-control\" placeholder=\"Contraseña\" aria-describedby=\"helpId\" " +
          "required> <br> "+
          "<!-- pattern=\"(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}\" -->" +
          
          "<div class=\"input-group\">" +

            "<input type=\"number\" name=\"\" id=\"FechaRegister\" class=\"form-control\" placeholder=\"\" aria-describedby=\"helpId\" " +
            "max=\"1979-12-31\" min=\"2000-01-02\" required>" +
            "<div class=\"input-group-prepend\">" +
              "<span class=\"input-group-text\"><i class=\"fas fa-calendar\"></i></span>" +
            "</div>" +
            
          "</div> <br>" +

          "<div class=\"form-check\" required>" +

            "<label class=\"form-check-label\">" +
              "<input type=\"radio\" class=\"form-check-input\" name=\"Test\" id=\"R1\" value=\"M\" checked> Mujer" +
              "<br>" +
              "<input type=\"radio\" class=\"form-check-input\" name=\"Test\" id=\"R2\" value=\"H\"> Hombre" +
            "</label>" +

          "</div> <br>" +
          

        "</form>";
          
          document.getElementById("EditModal").innerHTML = Str;
          
      }
  };
}

function editFuction(Modal) {
let id = Modal.getAttribute("saveID");

let xhr = new XMLHttpRequest();

xhr.open('PUT', URL + "/api/users/" + id);

xhr.setRequestHeader('Content-Type', 'application/json');

xhr.send();

xhr.onload = function () {
    if (xhr.status != 200) { 
    
        alert("Error con al editar");
        
    } else {
        alert("Usuario Actualizado correctamente");
        $('#ModalDelete').modal('hide');
    }
};

}

function deleteUser(){

  let StrT = "" + localStorage.token

  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", URL + "/api/users/" + StrT);
  xhr.setRequestHeader("x-user-token", localStorage.Token);
  xhr.send();
  
  xhr.onload = function() {
      if(xhr.status != 200 ){
        alert(xhr.response);
      }else{
        //delete localStorage.Token;
        localStorage.clear();
        alert("Usuario eliminado!");
        window.location.href = "Cuenta.html";
      }

  }
};

function loadUser(){
  let xhr = new XMLHttpRequest();

  let StrT = "" + localStorage.token

  xhr.open('GET', URL + "/api/users/" + StrT);

  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send();
  
  xhr.onload = function () {
    if (xhr.status != 200) { 
      
      cuentaDisplay.innerHTML = "<img src=\"/Frontend/Styles/angai313-spongebob-sad.gif\" alt=\"sdf\">"
        
    } else {

      UserListToHTML(JSON.parse(xhr.response));
          
    }
  };


}

function UserToHTML(User) {
  return  "<div class=\"container\" style=\"background-color: white; margin-left: auto; margin-left: auto; margin-top: 10px;\">" +
 " <div class=\"col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad\" style=\"background-color: white; margin-left: auto; margin-right: auto;\">" +

    "<div class=\"panel panel-info\">" +
      "<div class=\"panel-heading\" style=\"margin-left: auto; margin-right: auto\">" +
        "<h3 class=\"panel-title\" style=\"margin-left: auto; margin-right: auto;\">" + User.nombre + User.apellido + "</h3>" +
      "</div>" +

      "<div class=\"panel-body\" style=\"align-items: center;\">" +
        "<div class=\"row\">" +
          "<div class=\"col-md-3 col-lg-3 \" align=\"center\"> <img alt=\"User Pic\" src=\"" + User.imagen + "\" class=\"img-circle img-responsive\"> </div>" +
          
          "<div class=\" col-md-9 col-lg-9 \">" +
            "<table class=\"table table-user-information\">" +
              "<tbody>" +

                "<tr>" +
                  "<td>Date of Birth</td>" +
                  "<td>01/24/1988</td>" +
                "</tr>" +
             
                "</tr>" +
                  "<td>Home Address</td>" +
                  "<td>Kathmandu,Nepal</td>" +
                "</tr>" +
                
                "<tr>" +
                  "<td>Email</td>" +
                  "<td><a href=\"mailto:" + User.correo + "\">" + User.correo + "</a></td>" +
                "</tr>" +

                "<tr>" +
                  "<td>Phone Number</td>" +
                  "<td>" + User.numero + "</td>" +
                "</tr>" +
               
              "</tbody>" +
            "</table>" +
            "<div>" +
              "<button onclick=\"loadModalEdit(this)\" saveID=\" "+ User.uID +" \" type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#ModalInfo\">" +
              "Editar perfil" +
              "</button>" +
              "<button onclick=\"loadModalInfo(this)\" saveID=\" "+ User.uID +" \"  type=\"button\" class=\"btn btn-primary m-2\" data-toggle=\"modal\" data-target=\"#ModalInfo\">" +
              "Pedidos" +
              "</button>" +
              "<button onclick=\"deleteUser()\" saveID=\" "+ User.uID +" \"  type=\"button\" class=\"btn btn-danger m-2\" data-toggle=\"modal\" data-target=\"#ModalInfo\">" +
              "Borrar perfil" +
              "</button>" +
            "</div>" +
            
          "</div>" +
        "</div>" +
      "</div>" +
      
    "</div>" +
  "</div>" +
"</div>"
}

function UserListToHTML(UserList) {
  
let Str = UserToHTML(UserList);
cuentaDisplay.innerHTML = Str ;
}

