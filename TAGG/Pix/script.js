/* =========================================================
   TAGG CONNECT
   GERADOR PIX COPIA E COLA + QR CODE

   PARA NOVOS CLIENTES, ALTERE SOMENTE:

   PIX_CHAVE
   BENEFICIARIO
   CIDADE

========================================================= */


/* =========================================================
   DADOS DO CLIENTE
========================================================= */

const PIX_CHAVE = "06780251348";

const BENEFICIARIO = "FRANCISCO A DA SILVA";

const CIDADE = "TABULEIRO DO";

const TXID = "***";


/* =========================================================
   FORMATA VALOR
========================================================= */

function formatarValor(valor) {

    return Number(valor).toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


/* =========================================================
   CONVERTE VALOR
========================================================= */

function converterValor(valor) {

    valor = String(valor || "").trim();

    if (!valor) {

        return NaN;

    }


    valor = valor.replace(/\s/g, "");


    /*
        Exemplos aceitos:

        10
        10,00
        10.00
        1.500,50
    */

    if (
        valor.includes(",") &&
        valor.includes(".")
    ) {

        valor = valor.replace(/\./g, "");

        valor = valor.replace(",", ".");

    }

    else if (valor.includes(",")) {

        valor = valor.replace(",", ".");

    }


    return parseFloat(valor);

}


/* =========================================================
   REMOVE ACENTOS
========================================================= */

function removerAcentos(texto) {

    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


/* =========================================================
   LIMPA TEXTO DO BR CODE
========================================================= */

function prepararTexto(texto, limite) {

    texto = removerAcentos(texto);

    /*
        O BR Code utiliza caracteres simples.
        Transformamos em maiúsculas.
    */

    texto = texto
        .toUpperCase()
        .replace(/\s+/g, " ")
        .trim();


    /*
        Limite máximo do campo.
    */

    if (texto.length > limite) {

        texto = texto.substring(0, limite);

    }


    return texto;

}


/* =========================================================
   NORMALIZA CHAVE PIX

   Aceita:

   CNPJ:
   39.494.949/0001-20

   CPF:
   123.456.789-00

   Telefone:
   (88) 92180-1646

   E-mail:
   empresa@email.com

   Chave aleatória:
   mantém como informada.
========================================================= */

function prepararChave(chave) {

    chave = String(chave || "").trim();


    /*
        Detecta telefone brasileiro formatado
        ou somente números.
    */

    const numeros =
        chave.replace(/\D/g, "");


    /*
        Telefone brasileiro com DDD
        11 dígitos.

        Exemplo:

        88921801646

        vira:

        +5588921801646
    */

    if (numeros.length === 11) {

        return "+55" + numeros;

    }


    /*
        Telefone já com código do Brasil.

        Exemplo:

        5588921801646

        vira:

        +5588921801646
    */

    if (
        numeros.length === 13 &&
        numeros.startsWith("55")
    ) {

        return "+" + numeros;

    }


    /*
        CNPJ

        Remove pontuação.
    */

    if (numeros.length === 14) {

        return numeros;

    }


    /*
        CPF

        Remove pontuação.
    */

    if (numeros.length === 11) {

        return numeros;

    }


    /*
        E-mail ou chave aleatória.

        Mantém como cadastrada.
    */

    return chave;

}


/* =========================================================
   CRIA CAMPO EMV

   Estrutura:

   ID + TAMANHO + VALOR

   Exemplo:

   campoPix("00", "01")

   resulta:

   000201
========================================================= */

function campoPix(id, valor) {

    valor = String(valor);

    const tamanho = valor.length;


    if (tamanho > 99) {

        throw new Error(
            "Campo PIX excede 99 caracteres."
        );

    }


    return (
        id +
        String(tamanho).padStart(2, "0") +
        valor
    );

}


/* =========================================================
   CRC16-CCITT-FALSE

   POLINÔMIO:
   0x1021

   VALOR INICIAL:
   0xFFFF
========================================================= */

function crc16(payload) {

    let crc = 0xFFFF;


    for (
        let i = 0;
        i < payload.length;
        i++
    ) {

        crc ^= payload.charCodeAt(i);


        for (
            let j = 0;
            j < 8;
            j++
        ) {

            if (
                (crc & 0x8000) !== 0
            ) {

                crc =
                    (
                        (crc << 1) ^
                        0x1021
                    ) & 0xFFFF;

            }

            else {

                crc =
                    (crc << 1) &
                    0xFFFF;

            }

        }

    }


    return crc
        .toString(16)
        .toUpperCase()
        .padStart(4, "0");

}


/* =========================================================
   MONTA PIX

   ESTRUTURA:

   00 = Payload Format Indicator
   01 = Point of Initiation Method
   26 = Merchant Account Information
   52 = MCC
   53 = Moeda
   54 = Valor
   58 = País
   59 = Beneficiário
   60 = Cidade
   62 = Dados adicionais / TXID
   63 = CRC
========================================================= */

function montarPix(valor) {

    /* -----------------------------------------------------
       PREPARA DADOS
    ----------------------------------------------------- */

    const chave =
        prepararChave(PIX_CHAVE);


    const beneficiario =
        prepararTexto(
            BENEFICIARIO,
            25
        );


    const cidade =
        prepararTexto(
            CIDADE,
            15
        );


    /* -----------------------------------------------------
       MERCHANT ACCOUNT INFORMATION

       00 = GUI
       01 = CHAVE PIX
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       PAYLOAD
    ----------------------------------------------------- */

    let payload = "";


    /* -----------------------------------------------------
       00
       Payload Format Indicator
    ----------------------------------------------------- */

    payload += campoPix(
        "00",
        "01"
    );


    /* -----------------------------------------------------
       01
       Point of Initiation Method

       11 = QR Code estático
    ----------------------------------------------------- */

    payload += campoPix(
        "01",
        "11"
    );


    /* -----------------------------------------------------
       26
       Merchant Account Information
    ----------------------------------------------------- */

    payload += campoPix(
        "26",
        merchantAccountInformation
    );


    /* -----------------------------------------------------
       52
       Merchant Category Code
    ----------------------------------------------------- */

    payload += campoPix(
        "52",
        "0000"
    );


    /* -----------------------------------------------------
       53
       Transaction Currency

       986 = Real brasileiro
    ----------------------------------------------------- */

    payload += campoPix(
        "53",
        "986"
    );


    /* -----------------------------------------------------
       54
       VALOR
    ----------------------------------------------------- */

    payload += campoPix(
        "54",
        valor.toFixed(2)
    );


    /* -----------------------------------------------------
       58
       COUNTRY CODE
    ----------------------------------------------------- */

    payload += campoPix(
        "58",
        "BR"
    );


    /* -----------------------------------------------------
       59
       MERCHANT NAME

       Máximo 25 caracteres
    ----------------------------------------------------- */

    payload += campoPix(
        "59",
        beneficiario
    );


    /* -----------------------------------------------------
       60
       MERCHANT CITY

       Máximo 15 caracteres
    ----------------------------------------------------- */

    payload += campoPix(
        "60",
        cidade
    );


    /* -----------------------------------------------------
       62
       ADDITIONAL DATA FIELD

       05 = TXID
    ----------------------------------------------------- */

    const additionalData =

        campoPix(
            "05",
            TXID
        );


    payload += campoPix(
        "62",
        additionalData
    );


    /* -----------------------------------------------------
       63
       CRC

       O cálculo é feito incluindo:

       6304

       mas não incluindo o próprio CRC.
    ----------------------------------------------------- */

    payload += "6304";


    const crc =
        crc16(payload);


    /* -----------------------------------------------------
       PIX FINAL
    ----------------------------------------------------- */

    return payload + crc;

}


/* =========================================================
   VALIDA CRC DO PIX

   Antes de gerar o QR Code, conferimos se o próprio
   payload está matematicamente consistente.
========================================================= */

function validarCRC(pix) {

    if (!pix || pix.length < 8) {

        return false;

    }


    /*
        Os últimos 4 caracteres são o CRC.
    */

    const crcInformado =
        pix.substring(
            pix.length - 4
        );


    /*
        Remove o CRC e mantém 6304.
    */

    const payload =
        pix.substring(
            0,
            pix.length - 4
        );


    const crcCalculado =
        crc16(payload);


    return (
        crcInformado ===
        crcCalculado
    );

}


/* =========================================================
   GERA PIX
========================================================= */

function gerarPix() {

    const campoValor =
        document.getElementById(
            "valor"
        );


    const mensagem =
        document.getElementById(
            "mensagem"
        );


    const valor =
        converterValor(
            campoValor.value
        );


    /* -----------------------------------------------------
       VALIDA VALOR
    ----------------------------------------------------- */

    if (
        isNaN(valor) ||
        valor <= 0
    ) {

        mensagem.innerHTML =
            "Digite um valor válido para gerar o PIX.";

        return;

    }


    try {

        /* -------------------------------------------------
           MONTA PAYLOAD
        ------------------------------------------------- */

        const pix =
            montarPix(valor);


        /* -------------------------------------------------
           VALIDA CRC
        ------------------------------------------------- */

        if (!validarCRC(pix)) {

            throw new Error(
                "CRC inválido."
            );

        }


        console.log(
            "PIX GERADO:",
            pix
        );


        /* -------------------------------------------------
           LIMPA QR CODE ANTERIOR
        ------------------------------------------------- */

        const qrcode =
            document.getElementById(
                "qrcode"
            );


        qrcode.innerHTML = "";


        /* -------------------------------------------------
           GERA QR CODE
        ------------------------------------------------- */

        new QRCode(
            qrcode,
            {

                text: pix,

                width: 220,

                height: 220,

                correctLevel:
                    QRCode.CorrectLevel.M

            }
        );


        /* -------------------------------------------------
           PIX COPIA E COLA
        ------------------------------------------------- */

        document.getElementById(
            "pixCopiaCola"
        ).textContent = pix;


        /* -------------------------------------------------
           VALOR
        ------------------------------------------------- */

        document.getElementById(
            "valorGerado"
        ).textContent =
            "Valor: " +
            formatarValor(valor);


        /* -------------------------------------------------
           MOSTRA RESULTADO
        ------------------------------------------------- */

        document.getElementById(
            "resultado"
        ).style.display = "block";


        /* -------------------------------------------------
           MENSAGEM
        ------------------------------------------------- */

        mensagem.innerHTML =
            "✓ PIX gerado com sucesso!<br>" +
            "Escaneie o QR Code ou copie o PIX Copia e Cola.";


        /* -------------------------------------------------
           SCROLL
        ------------------------------------------------- */

        setTimeout(
            function() {

                document
                    .getElementById(
                        "resultado"
                    )
                    .scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

            },
            150
        );

    }

    catch (erro) {

        console.error(
            "Erro ao gerar PIX:",
            erro
        );


        mensagem.innerHTML =
            "Não foi possível gerar o PIX. " +
            "Confira os dados cadastrados.";

    }

}


/* =========================================================
   COPIAR CHAVE PIX
========================================================= */

function copiarChave() {

    const chave =
        prepararChave(
            PIX_CHAVE
        );


    copiarTexto(

        chave,

        function() {

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

function copiarPix() {

    const elemento =
        document.getElementById(
            "pixCopiaCola"
        );


    const pix =
        elemento.textContent.trim();


    if (!pix) {

        return;

    }


    copiarTexto(

        pix,

        function() {

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
   COPIAR TEXTO
========================================================= */

function copiarTexto(
    texto,
    sucesso
) {

    if (

        navigator.clipboard &&

        window.isSecureContext

    ) {

        navigator.clipboard
            .writeText(texto)

            .then(sucesso)

            .catch(function() {

                copiarFallback(
                    texto,
                    sucesso
                );

            });


        return;

    }


    copiarFallback(
        texto,
        sucesso
    );

}


/* =========================================================
   FALLBACK
========================================================= */

function copiarFallback(
    texto,
    sucesso
) {

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


    try {

        document.execCommand(
            "copy"
        );


        sucesso();

    }

    catch (erro) {

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
    document.getElementById(
        "valor"
    );


if (campoValor) {

    campoValor.addEventListener(

        "keydown",

        function(event) {

            if (
                event.key === "Enter"
            ) {

                gerarPix();

            }

        }

    );

}
