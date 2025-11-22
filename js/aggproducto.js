import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

const nombreUsuarioNavbar = document.getElementById("nombreUsuarioNavbar");
const cerrarSesionBtn = document.getElementById("cerrarSesion");
const formAgregarProducto = document.getElementById("formAgregarProducto");
const mensaje = document.getElementById("mensaje");

const ADMIN_EMAIL = "Admin01@gmail.com";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Solo admin puede ver esta página
  if (user.email !== ADMIN_EMAIL) {
    alert("No tienes permisos para agregar productos.");
    window.location.href = "productos.html";
    return;
  }

  nombreUsuarioNavbar.textContent = user.email;

  cerrarSesionBtn.addEventListener("click", async () => {
    await signOut(auth);
    localStorage.clear();
    window.location.href = "index.html";
  });
});

// Agregar producto
formAgregarProducto.addEventListener("submit", async (e) => {
  e.preventDefault();

  const producto = {
    nombre: document.getElementById("nombre").value,
    precio: parseFloat(document.getElementById("precio").value),
    imagen: document.getElementById("imagen").value
  };

  try {
    await addDoc(collection(db, "productos"), producto);
    mensaje.textContent = "✅ Producto agregado correctamente";
    mensaje.style.color = "green";
    formAgregarProducto.reset();
  } catch (error) {
    console.error(error);
    mensaje.textContent = "❌ Error al agregar el producto";
    mensaje.style.color = "red";
  }
});
