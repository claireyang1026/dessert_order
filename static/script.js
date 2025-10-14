console.log("JS 已載入！");

let cart = [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cart-list');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `${item.name} x ${item.qty} - $${item.price * item.qty}
      <button onclick="changeQty(${index}, -1)">－</button>
      <button onclick="changeQty(${index}, 1)">＋</button>
      <button onclick="removeItem(${index})">刪除</button>`;
    list.appendChild(li);
  });
  document.getElementById('total').innerText = total;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function submitOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("請先加入商品！");
    return;
  }

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const deliver = document.querySelector('input[name="deliver"]:checked').value;
  const address = document.getElementById('address').value;
  const note = document.getElementById('note').value;

  const products = cart.map(item => `${item.name} x${item.qty}`).join(', ');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const formData = new FormData();
  formData.append("entry.1526245042", name);      // Google 表單欄位代碼
  formData.append("entry.71025713", phone);
  formData.append("entry.1166613325", deliver);
  formData.append("entry.1476623840", address);
  formData.append("entry.827274360", note);
  formData.append("entry.2095776562", products);
  formData.append("entry.1853339618", total);

  fetch("https://docs.google.com/forms/d/e/1FAIpQLSeG3P8Nev9coyBoSOdGCTAJu49LgzUy0u7YxpZE9yWcvm7ScA/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: formData
  });

  alert("訂單已送出，感謝您的訂購！");
  clearCart();
  document.getElementById('order-form').reset();
}

function toggleAddress() {
  const deliveryMethod = document.querySelector('input[name="deliver"]:checked').value;
  const addressField = document.getElementById("address-field");
  const addressInput = document.getElementById("address");

  if (deliveryMethod === "宅配") {
    addressField.style.display = "block";
    addressInput.setAttribute("required", "true");
  } else {
    addressField.style.display = "none";
    addressInput.removeAttribute("required");
    addressInput.value = "";  // 清空地址欄
  }
}

