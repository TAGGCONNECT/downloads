/* =========================================================
   CONFIGURAÇÕES DA D PRINT
========================================================= */

const PIX_CHAVE = "39494949000120";

const BENEFICIARIO = "D PRINT COMUNICACAO VISUA";

const CIDADE = "TABULEIRO";

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


    /*
       Aceita:

       50
       50,00
       50.00
       1.500,50
    */

    valor = valor.replace(/\s/g,"");


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
   MONTA CAMPO PIX
========================================================= */

function campoPix(id, valor){

    const tamanho = String(valor).length;

    return (
        id +
        String(tamanho).padStart(2,"0") +
        valor
    );

}


/* =========================================================
   CRC16 - PADRÃO PIX
========================================================= */

function crc16(payload){

    let crc = 0xFFFF;


    for(let i = 0; i < payload.length; i++){

        crc ^= payload.charCodeAt(i);


        for(let j = 0; j < 8; j++){

            if((crc & 0x8000) !== 0){

                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;

            }

            else{

                crc = (crc << 1) & 0xFFFF;

            }

        }

    }


    return crc
        .toString(16)
        .toUpperCase()
        .padStart(4,"0");

}


/* =========================================================
   GERA O PIX COPIA E COLA
========================================================= */

function montarPix(valor){

    /*
       Merchant Account Information
    */

    const merchantAccountInformation =
        campoPix(
            "00",
            "br.gov.bcb.pix"
        ) +
        campoPix(
            "01",
            PIX_CHAVE
        );


    /*
       Montagem do payload
    */

    let payload = "";


    // Payload Format Indicator
    payload += campoPix(
        "00",
        "01"
    );


    // Merchant Account Information
    payload += campoPix(
        "26",
        merchantAccountInformation
    );


    // Merchant Category Code
    payload += campoPix(
        "52",
        "0000"
    );


    // Transaction Currency - BRL
    payload += campoPix(
        "53",
        "986"
    );


    // Valor
    payload += campoPix(
        "54",
        valor.toFixed(2)
    );


    // País
    payload += campoPix(
        "58",
        "BR"
    );


    // Beneficiário
    payload += campoPix(
        "59",
        BENEFICIARIO
    );


    // Cidade
    payload += campoPix(
        "60",
        CIDADE
    );


    // Additional Data Field Template
    payload += campoPix(
        "62",
        campoPix(
            "05",
            TXID
        )
    );


    /*
       Campo CRC.
       Primeiro acrescentamos 6304.
    */

    payload += "6304";


    /*
       Calcula CRC16
    */

    const crc = crc16(payload);


    /*
       Retorna o PIX Copia e Cola completo
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
        converterValor(campoValor.value);


    const mensagem =
        document.getElementById("mensagem");


    /*
       Verificação do valor
    */

    if(isNaN(valor) || valor <= 0){

        mensagem.innerHTML =
            "Digite um valor válido para gerar o PIX.";

        return;

    }


    /*
       Monta o payload
    */

    const pix =
        montarPix(valor);


    /*
       Limpa QR Code anterior
    */

    const qrcode =
        document.getElementById("qrcode");


    qrcode.innerHTML = "";


    /*
       Gera QR Code
    */

    new QRCode(qrcode, {

        text:pix,

        width:220,

        height:220,

        correctLevel:QRCode.CorrectLevel.M

    });


    /*
       Mostra PIX Copia e Cola
    */

    document.getElementById(
        "pixCopiaCola"
    ).textContent = pix;


    /*
       Mostra valor
    */

    document.getElementById(
        "valorGerado"
    ).textContent =
        "Valor: " + formatarValor(valor);


    /*
       Mostra resultado
    */

    document.getElementById(
        "resultado"
    ).style.display = "block";


    /*
       Mensagem
    */

    mensagem.innerHTML =
        "✓ PIX gerado com sucesso!<br>" +
        "Escaneie o QR Code ou copie o PIX Copia e Cola.";


    /*
       Rola suavemente até o resultado
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


/* =========================================================
   COPIAR CHAVE PIX
========================================================= */

function copiarChave(){

    /*
       No código do PIX, CNPJ deve ser utilizado
       somente com números.
    */

    const chave =
        PIX_CHAVE;


    copiarTexto(chave, function(){

        const mensagem =
            document.getElementById("mensagem");


        mensagem.innerHTML =
            "✓ Chave PIX copiada!<br>" +
            "Abra o aplicativo do seu banco de preferência e efetue o pagamento.";

    });

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


    copiarTexto(pix, function(){

        const mensagem =
            document.getElementById("mensagem");


        mensagem.innerHTML =
            "✓ PIX Copia e Cola copiado!<br>" +
            "Abra o aplicativo do seu banco de preferência e cole o código para efetuar o pagamento.";

    });

}


/* =========================================================
   FUNÇÃO UNIVERSAL DE CÓPIA
========================================================= */

function copiarTexto(texto, sucesso){

    /*
       Método moderno
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
       Método alternativo
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
        document.createElement("textarea");


    textarea.value = texto;


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

document
    .getElementById("valor")
    .addEventListener(
        "keydown",
        function(event){

            if(event.key === "Enter"){

                gerarPix();

            }

        }
    );
