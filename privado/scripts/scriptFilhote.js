const formularioFilhote = document.getElementById('formFilhote');
formularioFilhote.onsubmit = validarFormulario; //Apenas atribui a função, não chama ela
window.onload=buscarFilhote;//Carrega os dados dos filhotes
document.getElementById("excluir").onclick = excluirFilhote;
document.getElementById("atualizar").onclick = atualizarFilhote;

function validarFilhote(filhote){
    filhote.preventDefault();
    if (formularioFilhote.checkValidity()){
      formulariofilhote.classList.remove( "was-validated" );
      const especie = document.getElementById("especie").value;
      const raca = document.getElementById("raca").value;
      
      const filhote = {
        especie, 
        raca
      };

    cadastrarFilhote(filhote);

    }
    else{
        formulariofilhote.classList.add( "was-validated"); //diz para o bootstrap exibir as msg de validação
    }
}

function buscarFilhote() {
  fetch('http://localhost:3000/filhotes', { method: 'GET' })
    .then((resposta) => resposta.json())
    .then((dados) => {
      if (Array.isArray(dados)) {
        exibirTabelaFilhotes(dados);
      } else {
        mostrarMensagem(dados.mensagem, false);
      }
    })
    .catch((erro) => mostrarMensagem(erro.message, false));
}

function cadastrarFilhote(filhote) {
  // Lembrando que o nosso backend responde requisições HTTP - GET/POST/PUT/PATCH/DELETE
  // FETCH API para fazer requisições em HTTP
  fetch('http://localhost:3000//filhotes', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(filhote),
  })
  .then((resposta) => resposta.json())
  .then((dados) => {
    if (dados.status) {
      mostrarMensagem(dados.mensagem, true);
      buscarFilhote();
      limparFormulario();
    } else {
      mostrarMensagem(dados.mensagem, false);
    }
  })
  .catch((erro) => mostrarMensagem(erro.message, false));
}
function limparFormulario() {
  document.getElementById('codigo').value = '';
  document.getElementById('especie').value = '';
  document.getElementById('raca').value = '';
}

function mostrarMensagem(mensagem, sucesso = false){
  const divMensagem = document.getElementById('mensagem');
  if (sucesso){
      divMensagem.innerHTML=`
      <div class="alert alert-sucess" role="alert">
      ${mensagem}
      </div>
      `;
  }
  else{
      divMensagem.innerHTML = `
      <div class="alert alert-danger" role="alert">
      ${mensagem}
    </div>
    `;
  }
  setTimeout(()=>{
    divMensagem.innerHTML = ''
  }, 5000);
}

function exibirTabelaFilhotes(listaFilhotes) {
  const espacoTabela = document.getElementById('espacoTabela');
  espacoTabela.innerHTML = '';
  if (listaFilhotes.length > 0) {
    const tabela = document.createElement('table');
    tabela.className = 'table table-striped table-hover';
    const cabecalho = document.createElement('thead');
    cabecalho.innerHTML = `
      <tr>
          <th>#</th>
          <th>Espécie</th>
          <th>Raça</th>
          <th>Ações</th>
      </tr>
    `;
  tabela.appendChild(cabecalho);
  const corpo = document.createElement('tbody');
  for (let i = 0; i < listaFihlotes.length; i++) {
    const filhote = listaFilhotes[i];
    const linha = document.createElement( 'tr');
    linha.innerHTML = `
    <td>${filhote.codigo}</td>
    <td>${filhote.especie}</td>
    <td>${filhote.raca}</td>
    <td>
        <button onclick="selecionarFilhote('${filhote.codigo}','${filhote.especie}','${filhote.raca}')">      
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
          </svg>
        </button>
    </td>`;
      corpo.appendChild(linha);
    }
    tabela.appendChild(corpo);
    espacoTabela.appendChild(tabela);
  }
    else {
      espacoTabela.innerHTML = '<p>Nenhum cadastro foi encontrado!</p>';
    }
}
function selecionarFilhote(codigo, especie, raca){
  document.getElementById('codigo').value = codigo;
  document.getElementById('especie').value = especie;
  document.getElementById('raca').value = raca;
}

function atualizarFilhote() {
  const codigo = document.getElementById('codigo').value;
  if (confirm("Confirma atualização do Filhote?")) {
    const filhote = obterFilhoteDoFormulario('atualizacao');
    limparFormulario();
    if (filhote) {
      fetch(`http://localhost:3000//filhotes/${codigo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filhote)
      })
      .then((resposta) => {
        if (!resposta.ok) {
          return resposta.text().then(text => {
            throw new Error(`Erro na requisição: ${resposta.status} ${resposta.statusText} ${text}`);
          });
        }
        return resposta.json();
      })
      .then((dados) => {
        console.log(dados); // Verifique a resposta do servidor
        if (dados && dados.mensagem) {
          mostrarMensagem(dados.mensagem, true);
        } else {
          mostrarMensagem("Ocorreu um erro ao processar a solicitação.", false);
        }
        buscarFilhote();
      })
      .catch((erro) => {
        mostrarMensagem(erro.message, false);
      });
    } else {
      mostrarMensagem("Favor, informar corretamente os dados do Filhote!", false);
    }
  }
}

function excluirFilhote() {
  const codigo = document.getElementById('codigo').value;
  if (confirm("Confirma exclusão do Filhote?")) {
    fetch(`http://localhost:3000//filhotes/${codigo}`, {
      method: 'DELETE'
    })
    .then((resposta) => {
      if (!resposta.ok) {
        return resposta.text().then(text => {
          throw new Error(`Erro na requisição: ${resposta.status} ${resposta.statusText} ${text}`);
        });
      }
      return resposta.json();
    })
    .then((dados) => {
      console.log(dados); // Verifique a resposta do servidor
      if (dados && dados.mensagem) {
        mostrarMensagem(dados.mensagem, true);
      } else {
        mostrarMensagem("Ocorreu um erro ao processar a solicitação.", false);
      }
      buscarFilhote();
    })
    .catch((erro) => {
      mostrarMensagem(erro.message, false);
    });
  }
}

function obterFilhoteDoFormulario(tipoOperacao) {
  const especie = document.getElementById('especie').value;
  const raca = document.getElementById('raca').value;

  const filhote = {
    especie,
    raca,
  };

  // Verifica se a operação é para atualização
  if (tipoOperacao === 'atualizacao') {
    const codigo = document.getElementById('codigo').value;
    filhote.codigo = codigo;
  }

  return filhote;
}