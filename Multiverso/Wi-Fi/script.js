const wifi = {

    rede: "\brisa-multiverso",

    senha: "Clientevip1"

};

document.getElementById("rede").innerText = wifi.rede;
document.getElementById("senha").innerText = wifi.senha;

function copiarSenha() {

    navigator.clipboard.writeText(wifi.senha);

    const mensagem = document.getElementById("mensagem");
    const botao = document.getElementById("copiar");

    botao.innerHTML = '<i class="fa-solid fa-check"></i>';

    mensagem.innerHTML =
    "✅ Senha copiada!<br>Agora abra as configurações de Wi-Fi do seu celular e conecte-se à rede.";

}
