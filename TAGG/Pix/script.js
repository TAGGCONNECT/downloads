/* =========================================================
   CONFIGURAÇÕES DA TAGG
========================================================= */

const PIX_CHAVE = "+5588921801646";

const BENEFICIARIO = "FRANCISCO ANTONIO DA SILVA";

const CIDADE = "TABULEIRO";

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
   CONVERTE VALOR DIGITADO
========================================================= */

function converterValor(valor) {

    valor = String(valor).trim();

    if (!valor) {
        return NaN;
    }

    valor = valor.replace(/\s/g, "");

    /*
        Aceita:

        10
        10,00
        10.00
        1.500,50
        1500,50
    */

    if (valor.includes(",") && valor.includes(".")) {

        valor = valor.replace(/\./g, "");
        valor = valor.replace(",", ".");

    }

    else if (valor.includes(",")) {

        valor = valor.replace(",", ".");

    }

    return parseFloat(valor);

}


/* =========================================================
   CRIA CAMPO EMV/BR CODE

   Estrutura:

   ID + TAMANHO + VALOR
========================================================= */

function campoPix(id, valor) {

    valor = String(valor);

    const tamanho = valor.length;

    return (
        id +
        String(tamanho).padStart(2, "0") +
        valor
    );

}


/* =========================================================
   CRC16 CCITT-FALSE

   Padrão utilizado pelo BR Code Pix
========================================================= */

function crc16(payload) {

    let crc = 0xFFFF;

    for (let i = 0; i < payload.length; i++) {

        crc ^= payload.charCodeAt(i) << 8;

        for (let j = 0; j < 8; j++) {

            if ((crc & 0x8000) !== 0) {

                crc =
                    ((crc << 1) ^ 0x1021) & 0xFFFF;

            }

            else {

                crc =
                    (crc << 1) & 0xFFFF;

            }

        }

    }

    return crc
        .toString(16)
        .toUpperCase()
        .padStart(4, "0");

}


/* =========================================================
   MONTA O PIX COPIA E COLA
========================================================= */

function montarPix(valor) {

    /*
        -----------------------------------------------------
        MERCHANT ACCOUNT INFORMATION

        Campo 26

        00 = GUI
        01 = Chave Pix
        -----------------------------------------------------
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
        -----------------------------------------------------
        PAYLOAD
        -----------------------------------------------------
    */

    let payload = "";


    /*
        00 - Payload Format Indicator
    */

    payload += campoPix(
        "00",
        "01"
    );


    /*
        26 - Merchant Account Information
    */

    payload += campoPix(
        "26",
        merchantAccountInformation
    );


    /*
        52 - Merchant Category Code

        0000 = não especificado
    */

    payload += campoPix(
        "52",
        "0000"
    );


    /*
        53 - Transaction Currency

        986 = BRL
    */

    payload += campoPix(
        "53",
        "986"
    );


    /*
        54 - Transaction Amount

        Exemplo:
        10.00
    */

    payload += campoPix(
        "54",
        Number(valor).toFixed(2)
    );


    /*
        58 - Country Code
    */

    payload += campoPix(
        "58",
        "BR"
    );


    /*
        59 - Merchant Name
    */

    payload += campoPix(
        "59",
        BENEFICIARIO
    );


    /*
        60 - Merchant City
    */

    payload += campoPix(
        "60",
        CIDADE
    );


    /*
        62 - Additional Data Field Template

        05 = TxId

        *** = TxId padrão para QR Code estático
        sem identificador específico.
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
        -----------------------------------------------------
        CRC

        O campo 63 é formado por:

        63
        04
        CRC

        Para calcular o CRC, acrescentamos primeiro:

        6304
        -----------------------------------------------------
    */

    payload += "6304";


    /*
        Calcula o CRC sobre todo o payload
        até o campo 6304.
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

function gerarPix() {

    const campoValor =
        document.getElementById("valor");

    const mensagem =
        document.getElementById("mensagem");


    /*
        Verifica se os elementos existem
    */

    if (!campoValor) {

        console.error(
            "Campo #valor não encontrado."
        );

        return;

    }


    if (!mensagem) {

        console.error(
            "Elemento #mensagem não encontrado."
        );

        return;

    }


    /*
        Converte o valor
    */

    const valor =
        converterValor(
            campoValor.value
        );


    /*
        Validação
    */

    if (
        isNaN(valor) ||
        valor <= 0
    ) {

        mensagem.innerHTML =
            "Digite um valor válido para gerar o PIX.";

        return;

    }


    /*
        Gera o PIX Copia e Cola
    */

    const pix =
        montarPix(valor);


    /*
        Exibe no console para conferência

        F12 → Console
    */

    console.log(
        "PIX Copia e Cola:",
        pix
    );


    /*
        QR CODE
    */

    const qrcode =
        document.getElementById("qrcode");


    if (!qrcode) {

        console.error(
            "Elemento #qrcode não encontrado."
        );

        return;

    }


    /*
        Limpa QR Code anterior
    */

    qrcode.innerHTML = "";


    /*
        Verifica biblioteca QRCode
    */

    if (
        typeof QRCode ===
        "undefined"
    ) {

        mensagem.innerHTML =
            "Erro: biblioteca do QR Code não carregada.";

        console.error(
            "QRCode.js não foi carregado."
        );

        return;

    }


    /*
        Gera QR Code
    */

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


    /*
        Mostra PIX Copia e Cola
    */

    const pixCopiaCola =
        document.getElementById(
            "pixCopiaCola"
        );


    if (pixCopiaCola) {

        pixCopiaCola.textContent =
            pix;

    }


    /*
        Mostra valor
    */

    const valorGerado =
        document.getElementById(
            "valorGerado"
        );


    if (valorGerado) {

        valorGerado.textContent =
            "Valor: " +
            formatarValor(valor);

    }


    /*
        Mostra resultado
    */

    const resultado =
        document.getElementById(
            "resultado"
        );


    if (resultado) {

        resultado.style.display =
            "block";

    }


    /*
        Mensagem
    */

    mensagem.innerHTML =
        "✓ PIX gerado com sucesso!<br>" +
        "Escaneie o QR Code ou copie o PIX Copia e Cola.";


    /*
        Rola até o resultado
    */

    if (resultado) {

        setTimeout(function () {

            resultado.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 150);

    }

}


/* =========================================================
   COPIAR CHAVE PIX
========================================================= */

function copiarChave() {

    const mensagem =
        document.getElementById(
            "mensagem"
        );


    /*
        Copia somente os números,
        que é a forma correta da chave CNPJ
        dentro do payload Pix.
    */

    const chave =
        PIX_CHAVE;


    copiarTexto(
        chave,
        function () {

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


    const mensagem =
        document.getElementById(
            "mensagem"
        );


    if (!elemento) {

        return;

    }


    const pix =
        elemento.textContent.trim();


    if (!pix) {

        mensagem.innerHTML =
            "Gere o PIX primeiro.";

        return;

    }


    copiarTexto(
        pix,
        function () {

            mensagem.innerHTML =
                "✓ PIX Copia e Cola copiado!<br>" +
                "Abra o aplicativo do seu banco de preferência e cole o código para efetuar o pagamento.";

        }
    );

}


/* =========================================================
   FUNÇÃO UNIVERSAL DE CÓPIA
========================================================= */

function copiarTexto(
    texto,
    sucesso
) {

    /*
        Método moderno
    */

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(texto)
            .then(sucesso)
            .catch(function () {

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

    textarea.style.left =
        "-9999px";

    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    try {

        const resultado =
            document.execCommand(
                "copy"
            );


        if (resultado) {

            sucesso();

        }

        else {

            throw new Error(
                "Falha ao copiar"
            );

        }

    }

    catch (error) {

        const mensagem =
            document.getElementById(
                "mensagem"
            );


        if (mensagem) {

            mensagem.innerHTML =
                "Não foi possível copiar automaticamente. " +
                "Toque e segure o código para copiá-lo.";

        }

    }


    document.body.removeChild(
        textarea
    );

}


/* =========================================================
   ENTER NO CAMPO DE VALOR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const campoValor =
            document.getElementById(
                "valor"
            );


        if (campoValor) {

            campoValor.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        gerarPix();

                    }

                }
            );

        }

    }
);

