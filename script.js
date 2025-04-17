// Função para capitalizar a primeira letra de cada palavra
function capitalizeFirstLetter(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Abrir modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "flex";
  modal.style.opacity = "0";
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 50);
  document.body.style.overflow = "hidden";
}

// Fechar modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.opacity = "0";
  setTimeout(() => {
    modal.style.display = "none";
    if (modalId !== "cartModal") {
      clearForm(modalId);
    }
    document.body.style.overflow = "auto";
  }, 300);
}

// Limpar campos do modal e resetar quantidades (somente dentro do modal)
function clearForm(modalId) {
  const checkboxes = document.querySelectorAll(
    `#${modalId} input[type='checkbox']`
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const quantityDisplays = document.querySelectorAll(
    `#${modalId} .item-quantity`
  );
  quantityDisplays.forEach((display) => {
    display.innerText = "0";
  });
}

// Função para limpar o carrinho
function clearCart() {
  document.getElementById("cartItems").innerHTML = "";
  document.getElementById("cartTotal").innerText = "TOTAL: R$0.00";
}

// Função para coletar os itens dos modais e enviar ao carrinho
function submitOrder() {
  let allItems = [];
  let modals = ["modal1", "modal2", "modal4", "modal5", "modal6"]; // Adicionado modal6

  modals.forEach((modalId) => {
    const items = document.querySelectorAll(
      `#${modalId} input[type='checkbox']:checked`
    );

    items.forEach((item) => {
      let name = item.value.trim();
      let price = parseFloat(item.getAttribute("data-price")) || 0;
      let quantityInput = item
        .closest("label")
        .querySelector("input[type='number']");

      // Se houver um campo de quantidade (input number), pega esse valor, senão assume 1
      let quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

      if (name) {
        allItems.push({
          name: capitalizeFirstLetter(name.toLowerCase()),
          price: price,
          quantity: quantity,
        });
      }
    });
  });

  if (allItems.length === 0) {
    alert("Por favor, selecione pelo menos um item.");
    return;
  }

  // Adiciona os itens ao carrinho
  allItems.forEach((item) => {
    addToCart(item.name, item.price, item.quantity);
  });

  alert("Pedido enviado ao carrinho.");

  // Limpa os formulários e fecha os modais
  modals.forEach((modalId) => {
    clearForm(modalId);
    closeModal(modalId);
  });
}

// Função para abrir o carrinho
function openCart() {
  openModal("cartModal");
}

// Adicionar item ao carrinho (com quantidade)
function addToCart(name, price, quantity = 1) {
  const cartItems = document.getElementById("cartItems");
  let existingItem = document.querySelector(`[data-name="${name}"]`);

  if (existingItem) {
    let quantityElement = existingItem.querySelector(".item-quantity");
    let priceElement = existingItem.querySelector(".item-price");
    let currentQuantity = parseInt(quantityElement.innerText) + quantity;

    quantityElement.innerText = currentQuantity;
    priceElement.innerText = `R$${(price * currentQuantity).toFixed(2)}`;
    existingItem.setAttribute("data-quantity", currentQuantity);
  } else {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.setAttribute("data-name", name);
    cartItem.setAttribute("data-price", price);
    cartItem.setAttribute("data-quantity", quantity);

    cartItem.innerHTML = `
      <h3>${name}</h3>
      <p>PREÇO: <span class="item-price">R$${(price * quantity).toFixed(
        2
      )}</span></p>
      <div class="quantity-controls">
        <button onclick="updateQuantity('${name}', -1)">➖</button>
        <span class="item-quantity">${quantity}</span>
        <button onclick="updateQuantity('${name}', 1)">➕</button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  }

  updateCartTotal();
}

// Atualizar quantidade de um item no carrinho
function updateQuantity(name, change) {
  let item = document.querySelector(`[data-name="${name}"]`);
  if (item) {
    let quantityElement = item.querySelector(".item-quantity");
    let priceElement = item.querySelector(".item-price");
    let basePrice = parseFloat(item.getAttribute("data-price"));
    let quantity = parseInt(quantityElement.innerText) + change;

    if (quantity <= 0) {
      item.remove();
    } else {
      quantityElement.innerText = quantity;
      priceElement.innerText = `R$${(basePrice * quantity).toFixed(2)}`;
      item.setAttribute("data-quantity", quantity);
    }

    updateCartTotal();
  }
}

// Atualizar o total do carrinho
function updateCartTotal() {
  const cartItems = document.querySelectorAll("#cartItems .cart-item");
  let total = 0;

  cartItems.forEach((item) => {
    let price = parseFloat(
      item.querySelector(".item-price").innerText.replace("R$", "")
    );
    total += price;
  });

  document.getElementById("cartTotal").innerText = `TOTAL: R$${total.toFixed(
    2
  )}`;
}

// Campo de Endereço e Retirada
document.addEventListener("DOMContentLoaded", function () {
  const deliveryOptions = document.querySelectorAll(
    'input[name="deliveryOption"]'
  );
  const addressField = document.getElementById("addressField");

  // Opção de entrega e retirada
  deliveryOptions.forEach((option) => {
    option.addEventListener("change", function () {
      if (this.value === "Entrega") {
        addressField.style.display = "block"; // Mostrar os campos de endereço
      } else {
        addressField.style.display = "none"; // Esconder os campos se for "Retirada"
      }
    });
  });
});

// Aumentar e diminuir do modal
document.addEventListener("DOMContentLoaded", function () {
  // Selecionar todos os checkboxes no modal
  const checkboxes = document.querySelectorAll(".modal input[type='checkbox']");

  checkboxes.forEach((checkbox) => {
    // Criar elementos de controle de quantidade
    const container = document.createElement("div");
    container.classList.add("quantity-controls");

    const decreaseBtn = document.createElement("button");
    decreaseBtn.innerText = "➖";
    decreaseBtn.onclick = function () {
      updateItemQuantity(checkbox, -1);
    };

    const quantityDisplay = document.createElement("span");
    quantityDisplay.classList.add("item-quantity");
    quantityDisplay.innerText = "0";

    const increaseBtn = document.createElement("button");
    increaseBtn.innerText = "➕";
    increaseBtn.onclick = function () {
      updateItemQuantity(checkbox, 1);
    };

    // Remover o checkbox visualmente e substituir pelos botões
    checkbox.style.display = "none";
    container.appendChild(decreaseBtn);
    container.appendChild(quantityDisplay);
    container.appendChild(increaseBtn);
    checkbox.parentNode.appendChild(container);
  });
});

// Função para atualizar a quantidade do item
function updateItemQuantity(checkbox, change) {
  let quantityElement = checkbox.parentNode.querySelector(".item-quantity");
  let quantity = parseInt(quantityElement.innerText) + change;

  if (quantity < 0) {
    quantity = 0; // Evitar números negativos
  }

  quantityElement.innerText = quantity;

  // Marcar o checkbox como "checked" se a quantidade for maior que 0, ou desmarcar se for 0
  checkbox.checked = quantity > 0;
  checkbox.setAttribute("data-quantity", quantity);
}

// Alteração na função submitOrder para pegar a quantidade correta
function submitOrder() {
  let allItems = [];

  ["modal1", "modal2", "modal4", "modal5", "modal6"].forEach((modalId) => {
    const items = document.querySelectorAll(
      `#${modalId} input[type='checkbox']:checked`
    );
    items.forEach((item) => {
      let price = parseFloat(item.getAttribute("data-price")) || 0;
      let quantity = parseInt(item.getAttribute("data-quantity")) || 1; // Pega a quantidade salva

      for (let i = 0; i < quantity; i++) {
        allItems.push({
          name: capitalizeFirstLetter(item.value.toLowerCase()),
          price: price,
        });
      }
    });
  });

  if (allItems.length === 0) {
    alert("Por favor, selecione pelo menos um item.");
    return;
  }

  allItems.forEach((item) => {
    addToCart(item.name, item.price);
  });

  alert("Pedido enviado ao carrinho.");
  ["modal1", "modal2", "modal4"].forEach((modalId) => {
    clearForm(modalId);
    closeModal(modalId);
  });
}

// Função para enviar pedido ao WhatsApp
function sendOrder() {
  const cartItems = document.querySelectorAll("#cartItems .cart-item");
  if (cartItems.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let orderNumber = Math.floor(1000 + Math.random() * 9000);
  let message = `Olá 🤗, Segue pedido: #${orderNumber}\n\n`;

  let totalItems = 0;
  let orderSummary = {};

  cartItems.forEach((item) => {
    const name = item.querySelector("h3").innerText; // Nome do lanche
    const price = parseFloat(item.getAttribute("data-price"));
    const quantityElement = item.querySelector(".item-quantity");
    const quantity = quantityElement ? parseInt(quantityElement.innerText) : 1;

    totalItems += quantity;

    // Buscar ingredientes dentro do label
    let ingredients = "";
    const label = [...document.querySelectorAll("label")].find((lbl) =>
      lbl.textContent.includes(name)
    );

    if (label) {
      let textNodes = [...label.childNodes].filter(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      if (textNodes.length > 0) {
        ingredients = textNodes
          .map((node) => node.textContent.trim())
          .join(" ")
          .toLowerCase();
      }
    }

    if (orderSummary[name]) {
      orderSummary[name].quantity += quantity;
      orderSummary[name].totalPrice += price * quantity;
    } else {
      orderSummary[name] = {
        price,
        quantity,
        totalPrice: price * quantity,
        ingredients,
      };
    }
  });

  message += `📦 TOTAL DE ITENS: ${totalItems}\n\n`;
  message += "⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n\n";

  for (let item in orderSummary) {
    message += `📌 PEDIDO: ${item.toUpperCase()}\n\n`;

    // Se houver ingredientes, exibe com a palavra "Ingredientes"
    if (orderSummary[item].ingredients) {
      message += `🍔 INGREDIENTES: ${orderSummary[item].ingredients}\n\n`; // Adicionado um espaço extra
    }

    message += `🛒 QUANTIDADE: ${
      orderSummary[item].quantity
    }\n💵 PREÇO UNITÁRIO: R$${orderSummary[item].price.toFixed(2)}\n`;

    if (orderSummary[item].quantity > 1) {
      message += `💰 PREÇO TOTAL: R$${orderSummary[item].totalPrice.toFixed(
        2
      )}\n`;
    }

    message += "\n⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘\n\n";
  }

  const deliveryOption = document.querySelector(
    'input[name="deliveryOption"]:checked'
  );
  if (!deliveryOption) {
    alert("Por favor, selecione uma opção: Retirada ou Entrega.");
    return;
  }

  message += `🏍️ Opção de Entrega: ${deliveryOption.value}\n\n`;

  if (deliveryOption.value === "Entrega") {
    const address = document.getElementById("deliveryAddress").value.trim();
    if (address === "") {
      alert("Por favor, preencha o endereço de entrega.");
      return;
    }
    message += `📍 Endereço de Entrega: ${address}\n\n`;

    const referencePoint = document
      .getElementById("referencePoint")
      .value.trim();
    if (referencePoint) {
      message += `📍 Referência: ${referencePoint}\n\n`;
    }
  }

  message +=
    "🚨Se desejar remover ou adicionar ingredientes, informe-nos!🚨\n\n";
  message += "⚠️ Confirme se está tudo correto ⚠️\n\n";
  message += "💳 O pedido será feito após a confirmação do pagamento 💳\n\n";

  const total = document
    .getElementById("cartTotal")
    .innerText.replace("TOTAL: R$", "");
  message += `💰 TOTAL: R$${parseFloat(total).toFixed(2)}\n\n`;
  message += "🥰 As Maninhas Agradecem! 🥰\n";

  const phoneNumber = "5581994956795";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
  alert("Pedido enviado com sucesso!");

  // Limpar os campos de endereço e referência
  document.getElementById("deliveryAddress").value = "";
  document.getElementById("referencePoint").value = "";

  clearCart();
}

//Ano do footer //
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("currentYear").textContent = new Date().getFullYear();
});
