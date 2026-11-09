const listaDeProdutos = [];
let indiceEdicao = null;

// =========================================================================
// DESAFIO 1: Classe Produto com Encapsulamento Privado (#) e Validações
// =========================================================================
class Produto {
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        if (!nome || nome.trim() === "") {
            throw new Error("O nome do produto não pode estar vazio.");
        }
        if (preco <= 0) {
            throw new Error("O preço do produto deve ser maior que zero (R$ 0.00).");
        }
        if (quantidade <= 0) {
            throw new Error("A quantidade de itens deve ser maior que zero.");
        }

        this.nome = nome;
        this.#preco = preco;
        this.#quantidade = quantidade;
    }

    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    get subtotal() {
        return this.#preco * this.#quantidade;
    }
}


const form = document.getElementById("produto-form");
const tabelaCorpo = document.querySelector("#tabela-produtos tbody");
const botaoSubmit = form.querySelector("button[type='submit']");
const inputPesquisa = document.getElementById("filtro-pesquisa");

const inputNome = document.getElementById("nome");
const listaSugestoes = document.getElementById("sugestoes-lista");

function obterProdutosFiltrados() {
    const termo = inputPesquisa.value.toLowerCase();
    return listaDeProdutos.filter(produto => 
        produto.nome.toLowerCase().includes(termo)
    );
}

function atualizarTotalEstoque() {
    
    const produtosVisiveis = obterProdutosFiltrados();

    const valorTotal = produtosVisiveis.reduce((acumulador, produto) => {
        return acumulador + produto.subtotal;
    }, 0);

    const totalFormatado = valorTotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    document.getElementById("total-estoque").innerText = `Total em Estoque: ${totalFormatado}`;
}

function renderizarTabela() {
    tabelaCorpo.innerHTML = "";

    const produtosVisiveis = obterProdutosFiltrados();

    produtosVisiveis.forEach((produto) => {
        // Encontra o índice real do produto na lista original para manter as ações corretas
        const indexReal = listaDeProdutos.indexOf(produto);

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
            <td>
                <button class="btn-editar" onclick="prepararEdicao(${indexReal})">Editar</button>
                <button class="btn-remover" onclick="removerProduto(${indexReal})">Remover</button>
            </td>
        `;

        tabelaCorpo.appendChild(linha);
    });

    atualizarTotalEstoque();
}

function resetarModoInclusao() {
    indiceEdicao = null;
    botaoSubmit.innerText = "Adicionar Produto";
    form.reset();
}

function prepararEdicao(index) {
    const produto = listaDeProdutos[index];

    inputNome.value = produto.nome;
    document.getElementById("preco").value = produto.preco;
    document.getElementById("quantidade").value = produto.quantidade;

    indiceEdicao = index;
    botaoSubmit.innerText = "Salvar Alterações";

    inputNome.focus();
}

function removerProduto(index) {
    listaDeProdutos.splice(index, 1);

    if (indiceEdicao !== null) {
        if (indiceEdicao === index) {
            resetarModoInclusao();
        } else if (indiceEdicao > index) {
            indiceEdicao--;
        }
    }

    renderizarTabela();
}

document.getElementById("limpar-tabela").addEventListener("click", () => {
    listaDeProdutos.length = 0;
    resetarModoInclusao();
    renderizarTabela();
});


inputPesquisa.addEventListener("input", () => {
    renderizarTabela();
});


inputNome.addEventListener("input", () => {
    const digitado = inputNome.value.toLowerCase().trim();
    if (listaSugestoes) {
        listaSugestoes.innerHTML = "";

        if (digitado === "") return;

        const sugestoes = listaDeProdutos.filter(produto => 
            produto.nome.toLowerCase().includes(digitado)
        );

        sugestoes.forEach(produto => {
            const itemLi = document.createElement("li");
            itemLi.innerText = `${produto.nome} (R$ ${produto.preco.toFixed(2)} - Qtd: ${produto.quantidade})`;
            
            itemLi.addEventListener("click", () => {
                inputNome.value = produto.nome;
                document.getElementById("preco").value = produto.preco;
                document.getElementById("quantidade").value = produto.quantidade;
                listaSugestoes.innerHTML = "";
            });

            listaSugestoes.appendChild(itemLi);
        });
    }
});

document.addEventListener("click", (e) => {
    if (listaSugestoes && !inputNome.contains(e.target) && !listaSugestoes.contains(e.target)) {
        listaSugestoes.innerHTML = "";
    }
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = inputNome.value.trim();
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);

    if (nome === "") {
        alert("O nome do produto não pode estar vazio.");
        return;
    }
    if (isNaN(preco) || preco <= 0) {
        alert("O preço deve ser um número válido maior que zero.");
        return;
    }
    if (isNaN(quantidade) || quantidade <= 0) {
        alert("A quantidade deve ser um número válido maior que zero.");
        return;
    }

    try {
        const novoProduto = new Produto(nome, preco, quantidade);

        if (indiceEdicao === null) {
            listaDeProdutos.push(novoProduto);
        } else {
            listaDeProdutos[indiceEdicao] = novoProduto;
        }

        resetarModoInclusao();
        renderizarTabela();

    } catch (error) {
        alert(error.message);
    }
});