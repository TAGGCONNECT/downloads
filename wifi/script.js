const wifi={

rede:"CAFE_AROMA",

senha:"Cafe2026@"

};

document.getElementById("rede").innerText=wifi.rede;

document.getElementById("senha").innerText=wifi.senha;

function copiarSenha(){

navigator.clipboard.writeText(wifi.senha);

const mensagem=document.getElementById("mensagem");

const botao=document.getElementById("copiar");

botao.innerHTML='<i class="fa-solid fa-check"></i>';

mensagem.innerText="Senha copiada!";

setTimeout(()=>{

botao.innerHTML='<i class="fa-regular fa-copy"></i>';

mensagem.innerText="";

},2000);

}
