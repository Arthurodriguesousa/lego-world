const botaoTema = document.getElementById("botao-tema");

if (localStorage.getItem("tema") === "escuro") {
    document.body.classList.add("dark");
}

if (botaoTema) {
    botaoTema.addEventListener("click", function() {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("tema", "escuro");
        } else {
            localStorage.setItem("tema", "claro");
        }
    });
}

function lerLista(chave) {
    const texto = localStorage.getItem(chave);
    if (texto === null) {
        return [];
    }
    return JSON.parse(texto);
}

function salvarLista(chave, lista) {
    localStorage.setItem(chave, JSON.stringify(lista));
}

function mostrarAlerta(texto, tipo) {
    const area = document.getElementById("alerta");
    if (area) {
        area.innerHTML = '<div class="alert alert-' + tipo + ' alert-dismissible fade show" role="alert">' + texto + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    }
}

function mostrarFavoritos() {
    const lista = document.getElementById("lista-favoritos");
    if (!lista) {
        return;
    }
    const favoritos = lerLista("favoritos");
    lista.innerHTML = "";
    if (favoritos.length === 0) {
        lista.innerHTML = '<li class="list-group-item">Nenhum favorito ainda.</li>';
    }
    for (let i = 0; i < favoritos.length; i++) {
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.textContent = favoritos[i].nome + " (adicionado em " + favoritos[i].data + ")";
        const botao = document.createElement("button");
        botao.className = "btn btn-sm btn-outline-danger";
        botao.textContent = "Remover";
        botao.addEventListener("click", function() {
            favoritos.splice(i, 1);
            salvarLista("favoritos", favoritos);
            mostrarFavoritos();
        });
        item.appendChild(botao);
        lista.appendChild(item);
    }
}

const botoesFavoritar = document.querySelectorAll(".favoritar");
for (const botao of botoesFavoritar) {
    botao.addEventListener("click", function() {
        const favoritos = lerLista("favoritos");
        const nome = botao.dataset.nome;
        let existe = false;
        for (const favorito of favoritos) {
            if (favorito.nome === nome) {
                existe = true;
            }
        }
        if (existe) {
            mostrarAlerta(nome + " já está nos favoritos.", "warning");
        } else {
            favoritos.push({ nome: nome, data: new Date().toLocaleDateString("pt-BR") });
            salvarLista("favoritos", favoritos);
            mostrarAlerta(nome + " foi adicionado aos favoritos!", "success");
            mostrarFavoritos();
        }
    });
}
mostrarFavoritos();

function mostrarMensagens() {
    const lista = document.getElementById("lista-mensagens");
    if (!lista) {
        return;
    }
    const mensagens = lerLista("mensagens");
    lista.innerHTML = "";
    if (mensagens.length === 0) {
        lista.innerHTML = '<li class="list-group-item">Nenhuma mensagem enviada.</li>';
    }
    for (const mensagem of mensagens) {
        const item = document.createElement("li");
        item.className = "list-group-item";
        item.textContent = mensagem.data + " - " + mensagem.nome + " (" + mensagem.assunto + "): " + mensagem.mensagem;
        lista.appendChild(item);
    }
}

const formulario = document.getElementById("form-contato");
if (formulario) {
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();
        const mensagens = lerLista("mensagens");
        mensagens.push({
            nome: formulario.elements["nome"].value,
            email: formulario.elements["email"].value,
            telefone: formulario.elements["telefone"].value,
            assunto: formulario.elements["assunto"].value,
            mensagem: formulario.elements["mensagem"].value,
            data: new Date().toLocaleDateString("pt-BR")
        });
        salvarLista("mensagens", mensagens);
        formulario.reset();
        mostrarAlerta("Mensagem enviada e salva neste navegador!", "success");
        mostrarMensagens();
    });
}

const botaoLimpar = document.getElementById("limpar-mensagens");
if (botaoLimpar) {
    botaoLimpar.addEventListener("click", function() {
        localStorage.removeItem("mensagens");
        mostrarMensagens();
    });
}
mostrarMensagens();

const campoTelefone = document.getElementById("telefone");
if (campoTelefone) {
    campoTelefone.addEventListener("input", function() {
        const numeros = campoTelefone.value.replace(/\D/g, "").slice(0, 11);
        let texto = numeros;
        if (numeros.length > 10) {
            texto = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7) + "-" + numeros.slice(7);
        } else if (numeros.length > 6) {
            texto = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 6) + "-" + numeros.slice(6);
        } else if (numeros.length > 2) {
            texto = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
        }
        campoTelefone.value = texto;
    });
}
