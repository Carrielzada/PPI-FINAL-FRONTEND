const formularioInteressado = document.getElementById('formInteressado');
formularioInteressado.onsubmit = validarFormulario; //Apenas atribui a função, não chama ela
window.onload=buscarInteressado;//Carrega os dados dos Interessados
document.getElementById("excluir").onclick = excluirInteressado;
document.getElementById("atualizar").onclick = atualizarInteressado;

function validarInteressado(interessado){
    evento.preventDefault();
    if (formularioInteressado.checkValidity()){
      formularioInteressado.classList.remove( "was-validated" );
      const nome = document.getElementById("nome").value;
      const cpf = document.getElementById("cpf").value;
      const telefone = document.getElementById("telefone").value;
      const email = document.getElementById("email").value;
      
      const interessado = {
        nome, 
        cpf, 
        telefone, 
        email
      };

    cadastrarInteressado(interessado);

    }
    else{
        formularioInteressado.classList.add( "was-validated"); //diz para o bootstrap exibir as msg de validação
    }
}

function buscarInteressado() {
  fetch('http://localhost:3000/interessados', { method: 'GET' })
    .then((resposta) => resposta.json())
    .then((dados) => {
      if (Array.isArray(dados)) {
        exibirTabelaInteressados(dados);
      } else {
        mostrarMensagem(dados.mensagem, false);
      }
    })
    .catch((erro) => mostrarMensagem(erro.message, false));
}

function cadastrarInteressado(interessado) {
  // Lembrando que o nosso backend responde requisições HTTP - GET/POST/PUT/PATCH/DELETE
  // FETCH API para fazer requisições em HTTP
  fetch('http://localhost:3000//interessados', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(interessado),
  })
  .then((resposta) => resposta.json())
  .then((dados) => {
    if (dados.status) {
      mostrarMensagem(dados.mensagem, true);
      buscarInteressado();
      limparFormulario();
    } else {
      mostrarMensagem(dados.mensagem, false);
    }
  })
  .catch((erro) => mostrarMensagem(erro.message, false));
}
function limparFormulario() {
  document.getElementById('codigo').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('cpf').value = '';
  document.getElementById('telefone').value = '';
  document.getElementById('email').value = '';
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

function exibirTabelaInteressados(listaInteressados) {
  const espacoTabela = document.getElementById('espacoTabela');
  espacoTabela.innerHTML = '';
  if (listaInteressados.length > 0) {
    const tabela = document.createElement('table');
    tabela.className = 'table table-striped table-hover';
    const cabecalho = document.createElement('thead');
    cabecalho.innerHTML = `
      <tr>
          <th>#</th>
          <th>Nome</th>
          <th>CPF</th>
          <th>Telefone</th>
          <th>E-mail</th>
          <th>Ações</th>
      </tr>
    `;
  tabela.appendChild(cabecalho);
  const corpo = document.createElement('tbody');
  for (let i = 0; i < listaInteressados.length; i++) {
    const interessado = listaInteressados[i];
    const linha = document.createElement( 'tr');
    linha.innerHTML = `
    <td>${interessado.codigo}</td>
    <td>${interessado.nome}</td>
    <td>${interessado.cpf}</td>
    <td>${interessado.telefone}</td>
    <td>${interessado.email}</td>
    <td>
        <button onclick="selecionarInteressado('${interessado.codigo}','${interessado.nome}','${interessado.cpf}','${interessado.telefone}','${interessado.email}')">      
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
function selecionarInteressado(codigo, nome, cpf, telefone, email){
  document.getElementById('codigo').value = codigo;
  document.getElementById('nome').value = artista;
  document.getElementById('cpf').value = endereco;
  document.getElementById('telefone').value = cidade;
  document.getElementById('email').value = estado;
}

function atualizarInteressado() {
  const codigo = document.getElementById('codigo').value;
  if (confirm("Confirma atualização do Interessado?")) {
    const interessado = obterInteressadoDoFormulario('atualizacao');
    limparFormulario();
    if (interessado) {
      fetch(`http://localhost:3000//interessados/${codigo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(interessado)
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
        buscarInteressado();
      })
      .catch((erro) => {
        mostrarMensagem(erro.message, false);
      });
    } else {
      mostrarMensagem("Favor, informar corretamente os dados do Interessado!", false);
    }
  }
}

function excluirInteressado() {
  const codigo = document.getElementById('codigo').value;
  if (confirm("Confirma exclusão do Interessado?")) {
    fetch(`http://localhost:3000//interessados/${codigo}`, {
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
      buscarInteressado();
    })
    .catch((erro) => {
      mostrarMensagem(erro.message, false);
    });
  }
}

function obterInteressadoDoFormulario(tipoOperacao) {
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const telefone = document.getElementById('telefone').value;
  const email = document.getElementById('email').value;

  const interessado = {
    nome,
    cpf,
    telefone,
    email,
  };

  // Verifica se a operação é para atualização
  if (tipoOperacao === 'atualizacao') {
    const codigo = document.getElementById('codigo').value;
    interessado.codigo = codigo;
  }

  return interessado;
}