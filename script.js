// Array global que armazenará os produtos cadastrados
const listaDeProdutos = [];

// =========================================================================
// DESAFIO 1: Classe Produto com Encapsulamento Privado (#) e Validações
// =========================================================================
class Produto {
    // Declaração obrigatória de atributos privados no JavaScript
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        // Validações exigidas pelas regras de negócio
        if (!nome || nome.trim() === "") {
            throw new Error("O nome do produto não pode estar vazio.");
        }
        if (preco <= 0) {
            throw new Error("O preço do produto deve ser maior que zero (R$ 0.00).");
        }
        if (quantidade <= 0) {
            throw new Error("A quantidade de itens deve ser maior que zero.");
        }

        // Atribuição das propriedades
        this.nome = nome;
        this.#preco = preco;
        this.#quantidade = quantidade;
    }

    // Getters públicos para permitir que o sistema leia os valores protegidos
    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    // Getter dinâmico para calcular o subtotal de forma segura
    get subtotal() {
        return this.#preco * this.#quantidade;
    }
}

// Mapeamento de elementos do DOM
const form = document.getElementById("produto-form");
const tabelaCorpo = document.querySelector("#tabela-produtos tbody");

// =========================================================================
// DESAFIO 2: Indicadores Financeiros do Estoque (.reduce())
// =========================================================================
function atualizarTotalEstoque() {
    // Acumula o subtotal de todos os produtos do array
    const valorTotal = listaDeProdutos.reduce((acumulador, produto) => {
        return acumulador + produto.subtotal;
    }, 0);

    // Formata o valor final para a moeda padrão brasileira (R$)
    const totalFormatado = valorTotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // Atualiza o elemento de texto no HTML
    document.getElementById("total-estoque").innerText = `Total em Estoque: ${totalFormatado}`;
}

// Função auxiliar para renderizar a tabela na tela
function renderizarTabela() {
    // Limpa as linhas existentes para evitar duplicados
    tabelaCorpo.innerHTML = "";

    // Percorre a lista criando a estrutura HTML de cada linha
    listaDeProdutos.forEach((produto, index) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
            <td>
                <button class="btn-remover" onclick="removerProduto(${index})">Remover</button>
            </td>
        `;

        tabelaCorpo.appendChild(linha);
    });

    // Mantém o valor global do estoque atualizado
    atualizarTotalEstoque();
}

// =========================================================================
// DESAFIO 3: Gestão Dinâmica (Remoção Individual e Limpeza Total)
// =========================================================================

// Remove um produto individual usando o índice do Array
function removerProduto(index) {
    listaDeProdutos.splice(index, 1);
    renderizarTabela();
}

// Evento do botão de limpar tudo
document.getElementById("limpar-tabela").addEventListener("click", () => {
    listaDeProdutos.length = 0; // Esvazia o array original
    renderizarTabela();
});

// Evento de envio do formulário (Desafio 1 - Try/Catch)
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Captura os valores digitados
    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);

    try {
        // Tenta criar a instância da classe Produto (Ativa as validações do constructor)
        const novoProduto = new Produto(nome, preco, quantidade);
        
        // Se passar nas validações, adiciona e atualiza a interface
        listaDeProdutos.push(novoProduto);
        renderizarTabela();
        
        // Reseta os campos digitados no formulário
        form.reset();

    } catch (error) {
        // Caso ocorra um throw new Error(...), exibe no alert sem quebrar o app
        alert(error.message);
    }
});