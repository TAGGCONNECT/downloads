const wifi={

rede:"BARBEARIA_PRIME",

senha:"Barba2026@"

};

document.getElementById("rede").innerText=wifi.rede;

document.getElementById("senha").innerText=wifi.senha;

function copiarSenha(){

navigator.clipboard.writeText(wifi.senha);

const mensagem=document.getElementById("mensagem");

const botao=document.getElementById("copiar");

botao.innerHTML='<i class="fa-solid fa-check"></i>';

mensagem.innerText="Senha copiada! Agora abra as configurações de Wi-Fi do seu celular para conectar.";

