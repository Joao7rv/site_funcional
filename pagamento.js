document.addEventListener('DOMContentLoaded', function () {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const resumoDiv = document.getElementById('resumoCarrinho');

    let subtotal = 0;

    carrinho.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.innerHTML = `
        <p><strong>${item.nome}</strong></p> 
        <p>Tamanho: ${item.tamanho}</p> 
        <p>Qtd: ${item.quantidade}</p> 
        <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
        <hr>
      `;
      resumoDiv.appendChild(itemDiv);
      subtotal += item.preco * item.quantidade;
    });

    let frete = subtotal >= 199 ? 0 : 20;
    const taxas = 5;

    let descontoPrimeiraCompra = 0;
    if (usuarioLogado && !usuarioLogado.jaComprou) {
      descontoPrimeiraCompra = subtotal * 0.10;
    }

    window.resumoValores = {
      subtotal,
      frete,
      taxas,
      descontoPrimeiraCompra,
      descontoPix: 0,
      totalFinal: 0
    };

    const resumoFinal = document.createElement('div');
    resumoFinal.id = 'resumoValoresHtml';
    resumoDiv.appendChild(resumoFinal);

    atualizarResumo();
  });

  document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener('change', atualizarResumo);
  });

  function atualizarResumo() {
    const metodo = document.querySelector('input[name="pagamento"]:checked');
    if (!metodo || !window.resumoValores) return;

    const { subtotal, frete, taxas, descontoPrimeiraCompra } = window.resumoValores;

    let descontoPix = metodo.value === 'Pix' ? (subtotal - descontoPrimeiraCompra) * 0.05 : 0;

    const total = subtotal - descontoPrimeiraCompra - descontoPix + frete + taxas;

    window.resumoValores.descontoPix = descontoPix;
    window.resumoValores.totalFinal = total;

    const resumoHtml = `
      <p><strong>Subtotal:</strong> R$ ${subtotal.toFixed(2)}</p>
      <p><strong>Desconto primeira compra:</strong> -R$ ${descontoPrimeiraCompra.toFixed(2)}</p>
      <p><strong>Desconto pagamento via Pix:</strong> -R$ ${descontoPix.toFixed(2)}</p>
      <p><strong>Frete:</strong> R$ ${frete.toFixed(2)}</p>
      <p><strong>Taxas:</strong> R$ ${taxas.toFixed(2)}</p>
      <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
    `;

    document.getElementById('resumoValoresHtml').innerHTML = resumoHtml;
  }

  document.getElementById('formPagamento').addEventListener('submit', function (event) {
    event.preventDefault();

    const metodo = document.querySelector('input[name="pagamento"]:checked').value;

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLogado) {
      usuarioLogado.jaComprou = true;
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    }

    alert(`Pagamento com ${metodo} confirmado! Obrigado pela sua compra!`);
    localStorage.removeItem('carrinho');
    window.location.href = "index.html";
  });