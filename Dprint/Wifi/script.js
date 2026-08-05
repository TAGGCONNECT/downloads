const wifi = {

    rede: "\D Print",

    senha: "Clara2021@"

};

document.getElementById("rede").innerText = wifi.rede;
document.getElementById("senha").innerText = wifi.senha;

function copiarPix(){

    const chave = document.getElementById("chavePix").innerText;

    navigator.clipboard.writeText(chave);

    const mensagem = document.getElementById("mensagem");

    mensagem.innerHTML =
    "✅ Senha copiada!<br>Agora abra as configurações de Wi-Fi do seu celular e conecte-se à rede.";

}
