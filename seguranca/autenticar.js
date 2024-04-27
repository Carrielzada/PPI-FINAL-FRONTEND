export default function autenticar(requisicao, resposta, next){
    if (requisicao.session?.usuarioLogado){
        next();
    }
    else{
        resposta.redirect('/login.html');
    }
}