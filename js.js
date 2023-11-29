let totalScenes = 8; // Actualizar con el número total de escenas
let currentSceneIndex = 1;
let autoAdvanceTimer;
let currentScene = document.querySelector('#sceneStart');

const sceneStart = document.querySelector('#sceneStart');
const sobre = document.querySelector('#meme-invite');
sceneStart.style.height = window.innerHeight + 'px';
sceneStart.style.width = window.innerWidth + 'px';

let xPosition = 10;
let yPosition = 10;
let xSpeed = 2;
let ySpeed = 2;
let rotation = 0; // Ángulo de rotación inicial
let rotationSpeed = 3; // Velocidad de rotación
let animationFrameId;

function update() {
  sobre.style.left = xPosition + 'px';
  sobre.style.top = yPosition + 'px';
  sobre.style.transform = `rotate(${rotation}deg)`; // Aplica la rotación
}

function animate() {
  if (xPosition + sobre.clientWidth >= window.innerWidth || xPosition <= 0) {
    xSpeed = -xSpeed;
    rotationSpeed = -rotationSpeed; // Cambia la dirección de la rotación
  }
  if (yPosition + sobre.clientHeight >= window.innerHeight || yPosition <= 0) {
    ySpeed = -ySpeed;
    rotationSpeed = -rotationSpeed;
  }

  xPosition += xSpeed;
  yPosition += ySpeed;
  rotation += rotationSpeed; // Actualiza el ángulo de rotación
  update();

  animationFrameId = requestAnimationFrame(animate); // Llama a la siguiente animación
}

// Inicia la animación
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
  xPosition = 10;
  yPosition = 10;
  sceneStart.style.height = window.innerHeight + 'px';
  sceneStart.style.width = window.innerWidth + 'px';
});

function stopAnimation() {
  cancelAnimationFrame(animationFrameId);
}


document.getElementById("cancel").onclick = function (){
  document.getElementById('song').pause();
  document.getElementById('cat').style.display = "";

}

document.getElementById('meme-invite').onclick = function () {
  var song = document.getElementById('song');
  var crash = document.getElementById('crash');
  song.loop = true;
  crash.play();
  song.play();
  stopAnimation(); // Detiene la animación
  this.src = 'pics/sobreabierto.jpg';
  this.classList.add('zoom-and-move');
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Obtener la posición actual del elemento
  const rect = this.getBoundingClientRect();
  const currentX = rect.left + rect.width / 2;
  const currentY = rect.top + rect.height / 2;

  // Calcular el desplazamiento necesario para mover al centro
  const translateX = centerX - currentX;
  const translateY = centerY - currentY;

  // Aplicar la transformación para mover y escalar
  this.style.transform = `translate(${translateX}px, ${translateY}px) scale(4)`;

  setTimeout(() => {
    document.getElementById('controls').style.display = 'flex';
    document.getElementById('decos').style.display = '';
    document.getElementById('snowflakes').classList.add('snowflakes');
    const urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get('n');
    if (name) {
      name = name.replace(/_/g, " ");
      document.getElementById('pic').src = 'pics/' + name + '.jpg';
      [...document.getElementsByClassName("name")].forEach((e, i)=>{
          e.innerText = name;
      });
    }
    setupIndicators();
    changeScene(1); // Cargar GIFs aquí si se requiere hacer dinámicamente
    this.style.display = 'none'; // Una clase para animar el meme
  }, 1200);
};

document.getElementById('back').addEventListener('click', () => {
  advanceScene(-1);
});

document.getElementById('continue').addEventListener('click', () => {
  advanceScene(1);
});

function setupIndicators() {
  let container = document.getElementById('indicator-container');
  for (let i = 0; i < totalScenes; i++) {
    let indicator = document.createElement('div');
    let mark = document.createElement('div');
    indicator.classList.add('indicator');
    indicator.appendChild(mark);
    if (i === 0) indicator.classList.add('active');
    container.appendChild(indicator);
  }
}

function updateIndicator(newIndex) {
  newIndex--;
  let indicators = document.querySelectorAll('.indicator');
  indicators.forEach((ind, index) => {
    if (index === newIndex) {
      ind.classList.add('active');
    } else {
      ind.classList.remove('active');
    }

    let width = index <= newIndex ? '100%' : '0%';
    ind.querySelector('div').style.width = width;
  });
}

function advanceScene(next) {
  if (next > 0) {
    currentSceneIndex =
      currentSceneIndex == totalScenes ? 1 : currentSceneIndex + next;
  } else {
    currentSceneIndex = currentSceneIndex == 1 ? totalScenes : currentSceneIndex + next;
  }
  changeScene(currentSceneIndex);
  updateIndicator(currentSceneIndex);
}

function assignRandomAnimation(elements, animationType) {
  const fadeInAnimations = [
    'fadeIn1',
    'fadeIn2',
    'fadeIn3',
    'fadeIn4',
    'rotationIn',
    'rotationIn2',
    'rotationIn3',
    'rotationIn4',
    'rotationIn5',
  ];
  const fadeOutAnimations = ['basicOut'];

  elements.forEach((element, index) => {
    // Restablecer las propiedades antes de aplicar la nueva animación

    // Elegir y aplicar la animación basada en el tipo
    if (animationType === 'in') {
      element.style.display = '';
      element.style.opacity = '';
      element.style.animation = '';
      const delay = 200 * index;
      setTimeout(function () {
        let animationName =
          fadeInAnimations[Math.floor(Math.random() * fadeInAnimations.length)];
        element.style.animation = `${animationName} 1s forwards linear`;
      }, delay);
    } else {
      let animationName =
        fadeOutAnimations[Math.floor(Math.random() * fadeOutAnimations.length)];
      element.style.animation = `${animationName} 300ms forwards linear`;
    }
  });
}

function changeScene(newSceneId) {
  // Encuentra la escena actual y los elementos a animar
  let currentElements = currentScene.querySelectorAll('.anim');
  assignRandomAnimation(currentElements, 'out');

  // Iniciar un temporizador para el cambio de escena
  setTimeout(() => {
    // Ocultar la escena actual después de la animación de salida
    
    currentScene.style.display = 'none';

    // Mostrar la nueva escena
    let newScene = document.getElementById('scene' + newSceneId);
    newScene.style.display = 'block';
    currentScene = newScene;

    // Asignar y ejecutar animaciones de entrada a los nuevos elementos
    let newElements = newScene.querySelectorAll('.anim');
    assignRandomAnimation(newElements, 'in');
  }, 300); // Retraso de 500 ms

  // Reiniciar el avance automático
  clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = setTimeout(() => advanceScene(1), 10000);
}
