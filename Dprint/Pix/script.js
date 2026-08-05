const pagamento = {

beneficiario:"D Print Comunicação Visual LTDA",

tipo:"CNPJ",

chave:"39.494.949/0001-20",

banco:"Banco do Bradeso",

whatsapp:"5588999310520"

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
