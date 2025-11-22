import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Config Firebase
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

// Elementos DOM
const navbarOpciones = document.getElementById("navbarOpciones");
const botonesComprar = document.querySelectorAll(".btnComprar");

let usuarioLogueado = null;

onAuthStateChanged(auth, (user) => {
  usuarioLogueado = user;

  // Navbar dinámico
 if (user) {
  const nombre = localStorage.getItem("nombreUsuario") || user.displayName || "Usuario";
  navbarOpciones.innerHTML = `
    <div class="d-flex align-items-center">
      <span class="user-name text-white me-3">${nombre}</span>
      <a class="nav-link me-3" href="productos.html">Productos</a>
      <a class="nav-link me-3" href="carrito.html">Carrito</a>
      <a class="nav-link text-white" href="#" id="cerrarSesion">Cerrar sesión</a>
    </div>
  `;


    document.getElementById("cerrarSesion").addEventListener("click", async () => {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "index.html";
    });
  } else {
    navbarOpciones.innerHTML = `
      <span class="me-3 text-white">Invitado</span>
      <a class="nav-link d-inline" href="login.html" id="btnIniciarSesion">Iniciar Sesión</a>
    `;
  }
});

// Botones Comprar
botonesComprar.forEach(btn => {
  btn.addEventListener("click", async () => {
    if (!usuarioLogueado) {
      if (confirm("Debes iniciar sesión para agregar productos al carrito. ¿Deseas iniciar sesión ahora?")) {
        window.location.href = "login.html";
      }
      return;
    }

    const producto = {
      nombre: btn.dataset.nombre,
      precio: parseFloat(btn.dataset.precio),
      imagen: btn.dataset.imagen
    };

    try {
      await addDoc(collection(db, `usuarios/${usuarioLogueado.uid}/carrito`), producto);
      alert(`✅ ${producto.nombre} agregado al carrito`);
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      alert("❌ No se pudo agregar el producto al carrito");
    }
  });
});
