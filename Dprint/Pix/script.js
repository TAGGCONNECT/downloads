function copiarPix(){

    const chave = document
        .getElementById("chavePix")
        .innerText
        .trim();


    navigator.clipboard.writeText(chave)

        .then(function(){

            const mensagem =
                document.getElementById("mensagem");


            mensagem.innerHTML =
                "✓ Chave PIX copiada!<br>" +
                "Abra o aplicativo do seu banco de preferência e efetue o pagamento.";

        })

        .catch(function(){

            const mensagem =
                document.getElementById("mensagem");


            mensagem.innerHTML =
                "Não foi possível copiar automaticamente. " +
                "Toque e segure a chave para copiá-la.";

        });

}
