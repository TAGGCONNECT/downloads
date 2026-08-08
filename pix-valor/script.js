/*
==================================================
CONFIGURAÇÃO DO CLIENTE
==================================================
*/


const PIX_CONFIG = {

    chave: "39.494.949/0001-20",

    tipoChave: "CNPJ",

    beneficiario: "D PRINT COMUNICACAO VISUAL",

    cidade: "TABULEIRO DO NORTE",

    banco: "BANCO DO BRASIL"

};



/*
==================================================
GERAR PIX
==================================================
*/


function gerarPix(){

    const campoValor =
        document.getElementById("valor");


    let valorDigitado =
        campoValor.value.trim();


    if(!valorDigitado){

        mostrarMensagem(
            "Digite o valor que deseja pagar."
        );

        return;

    }


    /*
    Converte vírgula para ponto
    */

    valorDigitado =
        valorDigitado.replace(/\./g, "")
                     .replace(",", ".");


    const valor =
        parseFloat(valorDigitado);


    if(isNaN(valor) || valor <= 0){

        mostrarMensagem(
            "Digite um valor válido."
        );

        return;

    }


    /*
    Formata valor para o padrão PIX
    */

    const valorPix =
        valor.toFixed(2);


    /*
    Gera o PIX Copia e Cola
    */

    const payload =
        gerarPayloadPix(valorPix);


    /*
    Mostra QR Code
    */

    const qr =
        document.getElementById("qrcode");


    qr.innerHTML = "";


    new QRCode(qr, {

        text: payload,

        width: 200,

        height: 200,

        correctLevel: QRCode.CorrectLevel.M

    });



    /*
    Mostra código PIX
    */

    document.getElementById("codigoPix").value =
        payload;



    /*
    Mostra valor
    */

    document.getElementById("valorGerado").innerText =
        "Valor: R$ " +
        valor.toFixed(2).replace(".", ",");



    /*
    Mostra resultado
    */

    document.getElementById("resultado").style.display =
        "block";



    /*
    Limpa mensagem anterior
    */

    document.getElementById("mensagem").innerHTML =
        "";



    /*
    Desce a tela até o QR Code
    */

    document.getElementById("resultado")
        .scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

}



/*
==================================================
GERAR PAYLOAD PIX
==================================================
*/


function gerarPayloadPix(valor){


    const chave =
        PIX_CONFIG.chave;


    const nome =
        removerAcentos(
            PIX_CONFIG.beneficiario
        )
        .substring(0,25)
        .toUpperCase();


    const cidade =
        removerAcentos(
            PIX_CONFIG.cidade
        )
        .substring(0,15)
        .toUpperCase();



    /*
    Merchant Account Information

    00 = GUI
    01 = chave PIX
    */

    const merchantAccount =
        "0014br.gov.bcb.pix" +
        "01" +
        formatarCampo(chave);



    /*
    Payload base
    */

    let payload =

        "000201" +

        "26" +
        String(merchantAccount.length).padStart(2,"0") +
        merchantAccount +

        "52040000" +

        "5303986" +

        "54" +
        String(valor.length).padStart(2,"0") +
        valor +

        "5802BR" +

        "59" +
        String(nome.length).padStart(2,"0") +
        nome +

        "60" +
        String(cidade.length).padStart(2,"0") +
        cidade +

        "62070503***" +

        "6304";



    /*
    CRC16
    */

    const crc =
        crc16(payload);


    return payload + crc;

}



/*
==================================================
FORMATAR CAMPO PIX
==================================================
*/


function formatarCampo(valor){

    return (
        String(valor.length).padStart(2,"0") +
        valor
    );

}



/*
==================================================
CRC16
==================================================
*/


function crc16(payload){

    let crc = 0xFFFF;


    for(let i = 0; i < payload.length; i++){

        crc ^= payload.charCodeAt(i) << 8;


        for(let j = 0; j < 8; j++){

            if((crc & 0x8000) !== 0){

                crc =
                    (crc << 1) ^
                    0x1021;

            }else{

                crc =
                    crc << 1;

            }


            crc &=
                0xFFFF;

        }

    }


    return crc
        .toString(16)
        .toUpperCase()
        .padStart(4,"0");

}



/*
==================================================
COPIAR PIX
==================================================
*/


function copiarPix(){

    const campo =
        document.getElementById("codigoPix");


    const codigo =
        campo.value;


    navigator.clipboard.writeText(codigo)

        .then(function(){

            mostrarMensagem(
                "✓ PIX Copia e Cola copiado! Abra o aplicativo do seu banco e efetue o pagamento."
            );

        })

        .catch(function(){

            campo.select();

            document.execCommand("copy");


            mostrarMensagem(
                "✓ PIX Copia e Cola copiado! Abra o aplicativo do seu banco e efetue o pagamento."
            );

        });

}



/*
==================================================
MENSAGEM
==================================================
*/


function mostrarMensagem(texto){

    document.getElementById("mensagem").innerText =
        texto;

}



/*
==================================================
REMOVER ACENTOS
==================================================
*/


function removerAcentos(texto){

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");

}
