
/*
 * TAGG CONNECT — WI-FI
 * Dra. Samara Kílvia
 *
 * Altere os valores abaixo para configurar a rede.
 */

const wifi = {
  rede: 'NOME_DA_REDE_WIFI',
  senha: 'SENHA_DA_REDE_WIFI'
};

const elementoRede = document.getElementById('wifi-rede');
const elementoSenha = document.getElementById('wifi-senha');
const elementoMensagem = document.getElementById('mensagem');

const botaoCopiar = document.getElementById('copiar-senha');
const botaoConectar = document.getElementById('copiar-conectar');

elementoRede.textContent = wifi.rede;
elementoSenha.textContent = wifi.senha;

async function copiarSenha() {
  elementoMensagem.className = '';

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(wifi.senha);
    } else {
      const campoTemporario = document.createElement('textarea');

      campoTemporario.value = wifi.senha;
      campoTemporario.setAttribute('readonly', '');
      campoTemporario.style.position = 'fixed';
      campoTemporario.style.opacity = '0';

      document.body.appendChild(campoTemporario);
      campoTemporario.select();

      const copiado = document.execCommand('copy');
      campoTemporario.remove();

      if (!copiado) {
        throw new Error('Não foi possível copiar.');
      }
    }

    elementoMensagem.textContent =
      'Senha copiada! Agora abra as configurações de Wi-Fi do seu celular e conecte-se à rede.';

    elementoMensagem.className = 'sucesso';

  } catch (erro) {
    elementoMensagem.textContent =
      'Não foi possível copiar automaticamente. Selecione e copie a senha manualmente.';

    elementoMensagem.className = 'erro';
  }
}

botaoCopiar.addEventListener('click', copiarSenha);
botaoConectar.addEventListener('click', copiarSenha);
