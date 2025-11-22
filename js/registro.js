// registro.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// CONFIG DE TU PROYECTO
const firebaseConfig = {
    apiKey: "AIzaSyApK9VGFqGPfu46Vux4OU2Ta9BZlo4X1po",
    authDomain: "base-tienda-maquillaje.firebaseapp.com",
    projectId: "base-tienda-maquillaje",
    storageBucket: "base-tienda-maquillaje.firebasestorage.app",
    messagingSenderId: "314769856570",
    appId: "1:314769856570:web:7eed74842a637de629fd03",
    measurementId: "G-RZ848535G2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// FORM
const registerForm = document.getElementById("registerForm");
const errorMatch = document.getElementById("errorMatch");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmPass = document.getElementById("regConfirmPassword").value;

    if (password !== confirmPass) {
        errorMatch.style.display = "block";
        errorMatch.innerText = "Las contraseñas no coinciden.";
        return;
    }

    try {
        // CREA USUARIO
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // GUARDA EL NOMBRE EN FIRESTORE
        await setDoc(doc(db, "usuarios", user.uid), {
            nombre: name,
            email: email
        });

        // GUARDAMOS UID PARA LA SESIÓN
        localStorage.setItem("uid", user.uid);

        alert("Registro exitoso. Ahora inicia sesión.");
        window.location.href = "login.html";

    } catch (error) {
        errorMatch.style.display = "block";
        errorMatch.innerText = error.message;
    }
});
