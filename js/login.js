import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailLogin").value.trim();
  const password = document.getElementById("passwordLogin").value;

  if (!email || !password) {
    alert("Por favor ingresa tu correo y contraseña.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar datos locales
    const snap = await getDoc(doc(db, "usuarios", user.uid));
    if (snap.exists()) {
      const data = snap.data();
      localStorage.setItem("nombreUsuario", data.nombre);
      localStorage.setItem("correoUsuario", data.email);
    } else {
      localStorage.setItem("correoUsuario", user.email);
    }

    // Revisar si hay producto temporal
    const productoTemp = sessionStorage.getItem("productoTemporal");
    if (productoTemp) {
      const producto = JSON.parse(productoTemp);
      await addDoc(collection(db, `usuarios/${user.uid}/carrito`), producto);
      sessionStorage.removeItem("productoTemporal");
      window.location.href = "carrito.html"; // Llevar al carrito
      return;
    }

    // Si no había producto temporal, ir a productos
    window.location.href = "carrito.html";

  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
});



