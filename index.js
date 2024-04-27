import express from 'express';
import process from 'process';
import path from 'path';
import session from 'express-session';
import autenticar from './seguranca/autenticar.js';

const host='0.0.0.0'; //O ip 0.0.0.0 representa todas as interfaces (placas de rede) do computador onde essa aplicação for executada
const porta = 3000;  //Porta identifica um programa em execução no host hospedeiro

const app = express();

app.use(express.urlencoded({extended: true})); //biblioteca qs

//gerencie uma sessão como sendo uma espécie de memória adquirida pelo servidor para lembrar com quem ele conversa
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true,
    cookie: {  
        maxAge: 60 * 1000 * 15
    }
}))

app.post('/login', (requisicao, resposta)=>{
    const usuario = requisicao.body.usuario;
    const senha   = requisicao.body.senha;
    if (usuario && senha && usuario === 'vitor' && senha === '123'){
        requisicao.session.usuarioLogado = true;
        resposta.redirect('/cadastroInteressado.html');
    }
    else{
        resposta.redirect('/login.html');
    }
})

//O express oferece funcionalidades para permitir que conteúdo estático seja fornecido
app.use(express.static(path.join(process.cwd(), 'publico')));

app.use(autenticar, express.static(path.join(process.cwd(), 'privado')));

app.listen(porta, host, ()=>{
    console.log(`Servidor escutando em http://${host}:${porta}`);
})