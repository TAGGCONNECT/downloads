const wifi = {

rede:"BARBEARIA-PRIME",

senha:"Barba2026@"

};

document.getElementById("rede").innerText=wifi.rede;

document.getElementById("senha").value=wifi.senha;

function copiarSenha(){

navigator.clipboard.writeText(wifi.senha);

alert("Senha copiada!");

}
