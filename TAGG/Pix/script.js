/* =========================================================
   TAGG CONNECT — GERADOR PIX
   BR CODE / PIX COPIA E COLA

   Para utilizar em outro cliente, altere somente:

   PIX_CHAVE
   BENEFICIARIO
   CIDADE

   O restante do código não precisa ser alterado.
========================================================= */


/* =========================================================
   CONFIGURAÇÕES DO CLIENTE
========================================================= */

const PIX_CHAVE = "+5588921801646";

const BENEFICIARIO = "FRANCISCO A DA SILVA";

const CIDADE = "TABULEIRO DO";

const TXID = "***";


/* =========================================================
   FORMATA VALOR
========================================================= */

function formatarValor(valor){

    return Number(valor).toLocaleString("pt-BR", {

        style:"currency",

        currency:"BRL"

    });

}


/* =========================================================
   CONVERTE VALOR DIGITADO
========================================================= */

function converterValor(valor){

    valor = valor.trim();

    if(!valor){

        return NaN;

    }


    valor = valor.replace(/\s/g,"");


    /*
        Aceita:

        10
        10,00
        10.00
        1.500,50
    */

    if(valor.includes(",") && valor.includes(".")){

        valor = valor.replace(/\./g,"");

        valor = valor.replace(",", ".");

    }

    else if(valor.includes(",")){

        valor = valor.replace(",", ".");

    }


    return parseFloat(valor);

}


/* =========================================================
   REMOVE ACENTOS
========================================================= */

function removerAcentos(texto){

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");

}


/* =========================================================
   NORMALIZA TEXTO DO BR CODE
========================================================= */

function normalizarTexto(texto, limite){

    texto = String(texto || "");

    texto = removerAcentos(texto);

    texto = texto
        .toUpperCase()
        .replace(/\s+/g," ")
        .trim();

    /*
        Merchant Name:
        máximo 25 caracteres.

        Merchant City:
        máximo 15 caracteres.
    */

    if(texto.length > limite){

        texto = texto.substring(0, limite);

    }


    return texto;

}


/* =========================================================
   NORMALIZA CHAVE PIX
========================================================= */

function normalizarChavePix(chave){

    chave = String(chave || "").trim();


    /*
        TELEFONE

        Se vier:

        (88) 92180-1646

        transforma em:

        +5588921801646
    */

    let somenteNumeros =
        chave.replace(/\D/g,"");


    /*
        Telefone brasileiro com 11 dígitos
    */

    if(somenteNumeros.length === 11){

        return "+55" + somenteNumeros;

    }


    /*
        Telefone já contendo 55
    */

    if(
        somenteNumeros.length === 13 &&
        somenteNumeros.startsWith("55")
    ){

        return "+" + somenteNumeros;

    }


    /*
        CNPJ

        Remove:

        .
        /
        -
    */

    if(somenteNumeros.length === 14){

        return somenteNumeros;

    }


    /*
        CPF

        Remove:

        .
        -
    */

    if(somenteNumeros.length === 11){

        return somenteNumeros;

    }


    /*
        E-mail ou chave aleatória

        Mantém exatamente como cadastrada.
    */

    return chave;

}


/* =========================================================
   CAMPO PIX
========================================================= */

function campoPix(id, valor){

    valor = String(valor);

    const tamanho = valor.length;


    if(tamanho > 99){

        throw new Error(
            "Campo PIX excede o limite de 99 caracteres."
        );

    }


    return (

        id +

        String(tamanho).padStart(2,"0") +

        valor

    );

}


/* =========================================================
   CRC16 - CRC-16/CCITT-FALSE
========================================================= */

function crc16(payload){

    let crc = 0xFFFF;


    for(let i = 0; i < payload.length; i++){

        crc ^= payload.charCodeAt(i);


        for(let j = 0; j < 8; j++){

            if((crc & 0x8000) !== 0){

                crc =
                    ((crc << 1) ^ 0x1021) &
                    0xFFFF;

            }

            else{

                crc =
                    (crc << 1) &
                    0xFFFF;

            }

        }

    }


    return crc
        .toString(16)
        .toUpperCase()
        .padStart(4,"0");

}


/* =========================================================
   MONTA PIX COPIA E COLA
========================================================= */

function montarPix(valor){

    /*
        Normaliza os dados
    */

    const chave =
        normalizarChavePix(PIX_CHAVE);


    const beneficiario =
        normalizarTexto(
            BENEFICIARIO,
            25
        );


    const cidade =
        normalizarTexto(
            CIDADE,
            15
        );


    /*
        Merchant Account Information

        00 = GUI
        01 = Chave PIX

        GUI oficial do Pix:
        br.gov.bcb.pix
    */

    const merchantAccountInformation =

        campoPix(
            "00",
            "br.gov.bcb.pix"
        )

        +

        campoPix(
            "01",
            chave
        );


    /*
        INÍCIO DO PAYLOAD
    */

    let payload = "";


    /*
        Payload Format Indicator

        00 02 01
    */

    payload += campoPix(
        "00",
        "01"
    );


    /*
        Point of Initiation Method

        01 02 11

        11 = QR Code estático
    */

    payload += campoPix(
        "01",
        "11"
    );


    /*
        Merchant Account Information

        Campo 26
    */

    payload += campoPix(
        "26",
        merchantAccountInformation
    );


    /*
        Merchant Category Code

        0000 = não informado
    */

    payload += campoPix(
        "52",
        "0000"
    );


    /*
        Transaction Currency

        986 = Real brasileiro
    */

    payload += campoPix(
        "53",
        "986"
    );


    /*
        VALOR

        Exemplo:

        10.00
    */

    payload += campoPix(
        "54",
        valor.toFixed(2)
    );


    /*
        COUNTRY CODE

        BR = Brasil
    */

    payload += campoPix(
        "58",
        "BR"
    );


    /*
        NOME DO BENEFICIÁRIO

        Máximo 25 caracteres
    */

    payload += campoPix(
        "59",
        beneficiario
    );


    /*
        CIDADE

        Máximo 15 caracteres
    */

    payload += campoPix(
        "60",
        cidade
    );


    /*
        ADDITIONAL DATA FIELD

        05 = TxID

        *** = QR Code estático
    */

    const additionalData =

        campoPix(
            "05",
            TXID
        );


    payload += campoPix(
        "62",
        additionalData
    );


    /*
        CRC

        Antes do cálculo acrescentamos:

        63 + tamanho 04

        = 6304
    */

    payload += "6304";


    /*
        Calcula CRC
    */

    const crc =
        crc16(payload);


    /*
        PIX COPIA E COLA FINAL
    */

    return payload + crc;

}


/* =========================================================
   GERA PIX
========================================================= */

function gerarPix(){

    const campoValor =
        document.getElementById("valor");


    const valor =
        converterValor(
            campoValor.value
        );


    const mensagem =
        document.getElementById("mensagem");


    /*
        VALIDA VALOR
    */

    if(
        isNaN(valor) ||
        valor <= 0
    ){

        mensagem.innerHTML =
            "Digite um valor válido para gerar o PIX.";

        return;

    }


    try{

        /*
            MONTA PIX
        */

        const pix =
            montarPix(valor);


        /*
            LIMPA QR CODE ANTERIOR
        */

        const qrcode =
            document.getElementById("qrcode");


        qrcode.innerHTML = "";


        /*
            GERA QR CODE
        */

        new QRCode(
            qrcode,
            {

                text:pix,

                width:220,

                height:220,

                correctLevel:
                    QRCode.CorrectLevel.M

            }
        );


        /*
            MOSTRA PIX COPIA E COLA
        */

        document.getElementById(
            "pixCopiaCola"
        ).textContent = pix;


        /*
            MOSTRA VALOR
        */

        document.getElementById(
            "valorGerado"
        ).textContent =
            "Valor: " +
            formatarValor(valor);


        /*
            MOSTRA RESULTADO
        */

        document.getElementById(
            "resultado"
        ).style.display = "block";


        /*
            MENSAGEM
        */

        mensagem.innerHTML =
            "✓ PIX gerado com sucesso!<br>" +
            "Escaneie o QR Code ou copie o PIX Copia e Cola.";


        /*
            ROLA ATÉ O RESULTADO
        */

        setTimeout(function(){

            document
                .getElementById("resultado")
                .scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

        },150);

    }

    catch(error){

        console.error(error);

        mensagem.innerHTML =
            "Não foi possível gerar o PIX. " +
            "Confira os dados cadastrados.";

    }

}


/* =========================================================
   COPIAR CHAVE PIX
========================================================= */

function copiarChave(){

    const chave =
        normalizarChavePix(PIX_CHAVE);


    copiarTexto(

        chave,

        function(){

            const mensagem =
                document.getElementById(
                    "mensagem"
                );


            mensagem.innerHTML =
                "✓ Chave PIX copiada!<br>" +
                "Abra o aplicativo do seu banco de preferência e efetue o pagamento.";

        }

    );

}


/* =========================================================
   COPIAR PIX COPIA E COLA
========================================================= */

function copiarPix(){

    const elemento =
        document.getElementById(
            "pixCopiaCola"
        );


    const pix =
        elemento.textContent.trim();


    if(!pix){

        return;

    }


    copiarTexto(

        pix,

        function(){

            const mensagem =
                document.getElementById(
                    "mensagem"
                );


            mensagem.innerHTML =
                "✓ PIX Copia e Cola copiado!<br>" +
                "Abra o aplicativo do seu banco de preferência e cole o código para efetuar o pagamento.";

        }

    );

}


/* =========================================================
   FUNÇÃO UNIVERSAL DE CÓPIA
========================================================= */

function copiarTexto(texto, sucesso){

    /*
        MÉTODO MODERNO
    */

    if(

        navigator.clipboard &&

        window.isSecureContext

    ){

        navigator.clipboard

            .writeText(texto)

            .then(sucesso)

            .catch(function(){

                copiarFallback(
                    texto,
                    sucesso
                );

            });


        return;

    }


    /*
        MÉTODO ALTERNATIVO
    */

    copiarFallback(
        texto,
        sucesso
    );

}


/* =========================================================
   FALLBACK PARA COPIAR
========================================================= */

function copiarFallback(texto, sucesso){

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        texto;


    textarea.style.position =
        "fixed";


    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    try{

        document.execCommand(
            "copy"
        );


        sucesso();

    }

    catch(error){

        const mensagem =
            document.getElementById(
                "mensagem"
            );


        mensagem.innerHTML =
            "Não foi possível copiar automaticamente. " +
            "Toque e segure o código para copiá-lo.";

    }


    document.body.removeChild(
        textarea
    );

}


/* =========================================================
   ENTER NO CAMPO DE VALOR
========================================================= */

const campoValor =
    document.getElementById("valor");


if(campoValor){

    campoValor.addEventListener(

        "keydown",

        function(event){

            if(event.key === "Enter"){

                gerarPix();

            }

        }

    );

}
