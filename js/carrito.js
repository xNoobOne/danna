import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApK9VGFqGPfu46Vux4OU2Ta9BZlo4X1po",
  authDomain: "base-tienda-maquillaje.firebaseapp.com",
  projectId: "base-tienda-maquillaje",
  storageBucket: "base-tienda-maquillaje.appspot.com",
  messagingSenderId: "314769856570",
  appId: "1:314769856570:web:7eed74842a637de629fd03",
  measurementId: "G-RZ848535G2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const carritoLista = document.getElementById("carritoLista");
const carritoVacio = document.getElementById("carritoVacio");
const totalGeneral = document.getElementById("totalGeneral");
const cerrarSesionBtn = document.getElementById("cerrarSesion");
const nombreUsuarioNavbar = document.getElementById("nombreUsuarioNavbar");
const btnPagar = document.getElementById("btnPagar");
const navbarOpciones = document.getElementById("navbarOpciones"); // CORRECTO: usar id

// Email del admin
const emailAdmin = "Admin01@gmail.com";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Mostrar email en navbar
  nombreUsuarioNavbar.textContent = user.email;

  // Si es admin, agregar link "Agregar productos"
  if (user.email === emailAdmin) {
    if (!document.getElementById("linkAgregarProducto")) {
      const link = document.createElement("a");
      link.href = "../html/aggproducto.html";
      link.id = "linkAgregarProducto";
      link.className = "nav-link me-3 text-white";
      link.textContent = "Agregar productos";
      navbarOpciones.appendChild(link); // Agregado al navbar
    }
  }

  // Cerrar sesión
  cerrarSesionBtn.addEventListener("click", async () => {
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "../index.html";
  });

  // Revisar producto temporal
  const productoTemporal = sessionStorage.getItem("productoTemporal");
  if (productoTemporal) {
    const producto = JSON.parse(productoTemporal);
    await addDoc(collection(db, `usuarios/${user.uid}/carrito`), producto);
    sessionStorage.removeItem("productoTemporal");
  }

  // Mostrar carrito
  async function mostrarCarrito() {
    carritoLista.innerHTML = "";
    let total = 0;

    const carritoRef = collection(db, `usuarios/${user.uid}/carrito`);
    const snapshot = await getDocs(carritoRef);

    if (snapshot.empty) {
      carritoVacio.style.display = "block";
      totalGeneral.textContent = "0";
      return;
    }

    carritoVacio.style.display = "none";

    snapshot.forEach(docu => {
      const p = docu.data();
      total += p.precio;

      const item = document.createElement("div");
      item.classList.add("item-card");
      item.innerHTML = `
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <img src="${p.imagen}" width="60" class="me-3 rounded">
            <div>
              <p class="mb-1"><strong>${p.nombre}</strong></p>
              <p class="mb-0">COP $${p.precio.toLocaleString()}</p>
            </div>
          </div>
          <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
        </div>
      `;

      const btnEliminar = item.querySelector(".btn-eliminar");
      btnEliminar.addEventListener("click", async () => {
        await deleteDoc(doc(db, `usuarios/${user.uid}/carrito`, docu.id));
        mostrarCarrito();
      });

      carritoLista.appendChild(item);
    });

    totalGeneral.textContent = total.toLocaleString();
  }

  mostrarCarrito();

  // Pagar
  btnPagar.addEventListener("click", async () => {
    if (user.email === emailAdmin) {
      alert("El admin no puede realizar pagos.");
      return;
    }

    const carritoRef = collection(db, `usuarios/${user.uid}/carrito`);
    const snapshot = await getDocs(carritoRef);

    if (snapshot.empty) {
      alert("Tu carrito está vacío. Agrega productos antes de pagar.");
      return;
    }

    if (confirm("Se realizará el pago de tu carrito. ¿Deseas continuar?")) {
      alert("✅ Pago realizado con éxito. Gracias por tu compra!");
      for (const docu of snapshot.docs) {
        await deleteDoc(doc(db, `usuarios/${user.uid}/carrito`, docu.id));
      }
      mostrarCarrito();
    }
  });
});

