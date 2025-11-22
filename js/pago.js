// JS para simular el pago

// Tomamos los productos del carrito (localStorage o sessionStorage)
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Elementos del DOM
const resumenCarrito = document.getElementById('resumenCarrito');
const totalPago = document.getElementById('totalPago');
const btnSimularPago = document.getElementById('btnSimularPago');

let total = 0;

// Mostrar productos en el resumen
if(carrito.length === 0){
  resumenCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
} else {
  carrito.forEach(p => {
    total += p.precio;
    const div = document.createElement('div');
    div.classList.add('item-card');
    div.innerHTML = `<strong>${p.nombre}</strong> - COP $${p.precio.toLocaleString()}`;
    resumenCarrito.appendChild(div);
  });
}

totalPago.textContent = total.toLocaleString();

// Simular pago
btnSimularPago.addEventListener('click', () => {
  if(carrito.length === 0){
    alert("Tu carrito está vacío. Agrega productos antes de pagar.");
    return;
  }

  alert(`✅ Pago de COP $${total.toLocaleString()} realizado con éxito. Gracias por tu compra!`);

  // Limpiar carrito simulado
  localStorage.removeItem('carrito');
  resumenCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
  totalPago.textContent = "0";
});
