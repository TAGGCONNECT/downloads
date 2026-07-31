const pagamento = {

beneficiario:"TAGG Connect",

tipo:"TELEFONE",

chave:"88 9.2180-1646",

banco:"Banco do Brasil",

whatsapp:"5588921801646"

};



document.getElementById("beneficiario").innerText=pagamento.beneficiario;

document.getElementById("tipo").innerText=pagamento.tipo;

document.getElementById("chave").value=pagamento.chave;

document.getElementById("banco").innerText=pagamento.banco;



function copiarPix(){

navigator.clipboard.writeText(pagamento.chave);

alert("Chave PIX copiada!");

}



function abrirWhatsapp(){

window.open(

`https://wa.me/${pagamento.whatsapp}?text=Olá! Acabei de realizar o pagamento via PIX. Segue o comprovante.`,

"_blank"

);

}
