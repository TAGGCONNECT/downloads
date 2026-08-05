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
    "✅ Chave PIX copiada!<br>" +
    "Abra o aplicativo do seu banco de preferência e efetue o pagamento.";

}
