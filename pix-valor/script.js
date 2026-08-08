*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial,Helvetica,sans-serif;
}


body{

    background:#111;

    display:flex;

    justify-content:center;

    align-items:center;

    min-height:100vh;

    padding:25px;

    color:white;

}


.container{

    width:100%;

    max-width:420px;

}


/* PIX */

.pix-icon{

    font-size:55px;

    font-weight:bold;

    color:#39FF00;

    text-align:center;

    margin-bottom:20px;

}


/* TÍTULO */

h1{

    text-align:center;

    font-size:30px;

    margin-bottom:10px;

}


/* DESCRIÇÃO */

.descricao{

    text-align:center;

    color:#bfbfbf;

    margin-bottom:30px;

    line-height:1.5;

}


/* INFORMAÇÕES */

.informacao{

    background:#242424;

    border-radius:18px;

    padding:15px 18px;

    margin-bottom:15px;

    text-align:center;

}


.titulo{

    display:block;

    font-size:14px;

    color:#bdbdbd;

    margin-bottom:6px;

}


.informacao strong{

    display:block;

    color:#39FF00;

    font-size:18px;

    word-break:break-word;

}


/* CAMPO DO VALOR */

.campo{

    margin-top:25px;

    margin-bottom:20px;

}


label{

    display:block;

    text-align:center;

    margin-bottom:12px;

    font-size:15px;

    color:#bdbdbd;

}


/* VALOR */

.valor-box{

    background:#242424;

    border-radius:18px;

    padding:16px 20px;

    display:flex;

    align-items:center;

    justify-content:center;

    gap:8px;

}


.valor-box span{

    font-size:25px;

    font-weight:bold;

    color:#39FF00;

}


.valor-box input{

    width:150px;

    background:none;

    border:none;

    outline:none;

    color:#39FF00;

    font-size:28px;

    font-weight:bold;

    text-align:left;

}


.valor-box input::placeholder{

    color:#777;

}


/* BOTÃO */

.botao{

    width:100%;

    border:none;

    border-radius:18px;

    padding:17px;

    background:#39FF00;

    color:#111;

    font-size:16px;

    font-weight:bold;

    cursor:pointer;

    transition:.25s;

}


.botao:hover{

    transform:scale(1.02);

}


/* RESULTADO */

.resultado{

    display:none;

    margin-top:30px;

    text-align:center;

}


/* QR CODE */

.qrcode{

    background:white;

    width:220px;

    height:220px;

    padding:10px;

    margin:0 auto 20px;

    border-radius:15px;

    display:flex;

    align-items:center;

    justify-content:center;

}


.qrcode img{

    max-width:100%;

}


/* VALOR GERADO */

.valor-gerado{

    color:#39FF00;

    font-size:20px;

    font-weight:bold;

    margin-bottom:22px;

}


/* COPIA E COLA */

.pix-copia{

    text-align:left;

}


.pix-copia > span{

    display:block;

    text-align:center;

    color:#bdbdbd;

    font-size:14px;

    margin-bottom:10px;

}


.codigo{

    display:flex;

    align-items:center;

    gap:8px;

}


.codigo input{

    flex:1;

    min-width:0;

    background:#242424;

    border:none;

    border-radius:14px;

    padding:14px;

    color:#bdbdbd;

    font-size:12px;

    outline:none;

}


.copiar{

    width:48px;

    height:48px;

    border:none;

    border-radius:14px;

    background:#242424;

    color:#39FF00;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;

    flex-shrink:0;

    transition:.25s;

}


.copiar:hover{

    transform:scale(1.08);

}


/* MENSAGEM */

.mensagem{

    margin-top:18px;

    color:#39FF00;

    font-size:14px;

    line-height:1.5;

    min-height:40px;

}
