
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const container = document.getElementById('produtosCarrinho');
    const subtotalElem = document.getElementById('subtotal');
    const totalElem = document.getElementById('total');
    const contadorElem = document.getElementById('contadorCarrinho');

    let subtotal = 0;
    container.innerHTML = '';

    carrinho.forEach((item, index) => {
      subtotal += item.preco * item.quantidade;

      const produtoHTML = document.createElement('div');
      produtoHTML.classList.add('produto');
      produtoHTML.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}" width="80">
        <div>
          <h4>${item.nome}</h4>
          <p>Preço: R$ ${item.preco.toFixed(2)}</p>
          <p>Tam: ${item.tamanho}</p>
          <p>Qtd: ${item.quantidade}</p>
          <button class="remover" data-index="${index}">Remover</button>
        </div>
        <hr>
      `;

      container.appendChild(produtoHTML);
    });
    

    let frete = 20;
    const taxas = 5;

if (subtotal >= 199) {
  frete = 0;
}

const total = subtotal + frete + taxas;

    document.getElementById('subtotal').textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
document.getElementById('total').textContent = `Total: R$ ${total.toFixed(2)}`;
document.querySelector('.resumo-compra p:nth-child(2)').textContent = `Frete: R$ ${frete.toFixed(2)}`;

if (frete === 0) {
  alert("Parabéns! Você ganhou Frete Grátis 🎉");
}

    contadorElem.textContent = carrinho.length;

    const botoesRemover = document.querySelectorAll('.remover');
    botoesRemover.forEach(botao => {
      botao.addEventListener('click', () => {
        const index = botao.getAttribute('data-index');
        carrinho.splice(index, 1); 
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho(); 
      });
    });
  }

  
  document.addEventListener('DOMContentLoaded', carregarCarrinho);