// tutoriales.js
// Aquí solo defines los tutoriales; agrega tus propias imágenes y links
const tutoriales = [
  { titulo: "Tutorial 1", imagen: "", link: "https://www.youtube.com/shorts/EdYip8Ear9E" },
  { titulo: "Tutorial 2", imagen: "", link: "https://www.youtube.com/watch?v=bIvcvNp7U9A" },
  { titulo: "Tutorial 3", imagen: "", link: "https://www.youtube.com/watch?v=ydc-BEgtF2I" },
  { titulo: "Tutorial 4", imagen: "", link: "https://www.youtube.com/watch?v=2W1aQzfvYxY" }
];

const carouselInner = document.getElementById("carousel-inner");

tutoriales.forEach((tut, index) => {
  const activeClass = index === 0 ? "active" : "";
  const slide = document.createElement("div");
  slide.className = `carousel-item ${activeClass}`;
  slide.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-4 mb-3">
        <div class="card">
          <img src="${tut.imagen}" class="card-img-top" alt="${tut.titulo}">
          <div class="card-body">
            <h5 class="card-title">${tut.titulo}</h5>
            <a href="${tut.link}" target="_blank" class="btn btn-video">Ver Tutorial</a>
          </div>
        </div>
      </div>
    </div>
  `;
  carouselInner.appendChild(slide);
});
