let boostActive = false;
let boostInterval;
let originalVelocity;
let canBoost = true; // Variable para manejar el cooldown
let reduceSpeed = 0.1; // Velocidad de reducción, ajustable
let lengthLoss = 2; // Pérdida de longitud, ajustable

// Evento para el botón de boost
document.getElementById('boost-button').addEventListener('mousedown', () => {
    if (canBoost && snake.body.length >7) { // Verificamos que la longitud de la serpiente sea mayor a 5
        activateBoost();
    } else if (snake.body.length <= 7) {
        console.log("La serpiente es demasiado pequeña para activar el boost");
    } else if (!canBoost) {
        console.log("El boost está en cooldown");
    }
});

document.getElementById('boost-button').addEventListener('mouseup', deactivateBoost);
document.getElementById('boost-button').addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (canBoost && snake.body.length > 7) { // Verificamos que la longitud de la serpiente sea mayor a 5
        activateBoost();
    } else if (snake.body.length <=7) {
        console.log("La serpiente es demasiado pequeña para activar el boost");
    } else if (!canBoost) {
        console.log("El boost está en cooldown");
    }
});

document.getElementById('boost-button').addEventListener('touchend', (event) => {
    event.preventDefault();
    deactivateBoost();
});

function activateBoost() {
    if (!boostActive) {
        boostActive = true;
        canBoost = false; // Iniciamos el cooldown
        originalVelocity = snake.velocity;
        snake.boostVelocity = snake.boostVelocity || 2.8; // Asegúrate de que boostVelocity esté inicializado
        snake.velocity = snake.boostVelocity; // Usamos la velocidad de boost

        // Intervalo para dejar comida y reducir longitud y ancho
        boostInterval = setInterval(() => {
            if (snake.body.length > 12) {
                // Reduce la longitud de la serpiente de manera gradual
                snake.body.pop();

                // Reduce el ancho de la serpiente de manera moderada
                snake.radio = Math.max(snake.radio - reduceSpeed,9); // Aseguramos que el radio no sea menor a 5
                snake.body.forEach(segment => {
                    segment.radio = Math.max(segment.radio - reduceSpeed, 9);
                });

                // Dejar comida con una probabilidad moderada
                if (Math.random() < 0.25) { // Ajusta la probabilidad según sea necesario
                    const lastSegment = snake.body[snake.body.length - 1];
                    apples.push(new Apple({
                        x: lastSegment.path[lastSegment.path.length - 1].x,
                        y: lastSegment.path[lastSegment.path.length - 1].y
                    }, 8, 'red', ctx)); // Tamaño igual al de las manzanas
                }
            } else {
                deactivateBoost(); // Si la longitud es menor al mínimo, detenemos el boost
            }
        }, 600); // Cada 100ms
    }
}

function deactivateBoost() {
    boostActive = false;
    clearInterval(boostInterval);
    snake.velocity = originalVelocity; // Restauramos la velocidad original

    // Iniciamos el cooldown de 2 segundos
    setTimeout(() => {
        canBoost = true; // Permitimos volver a usar el boost después de 2 segundos
    }, 2000);
}



    
    
    
    
//mapa 
        
const worldWidth = 4000;
const worldHeight = 4000;


        function updateView(snake) {
    const offsetX = Math.min(Math.max(snake.position.x - canvas.width / 2, 0), worldWidth - canvas.width);
    const offsetY = Math.min(Math.max(snake.position.y - canvas.height / 2, 0), worldHeight - canvas.height);

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transform
    ctx.translate(-offsetX, -offsetY);
}

    
    
    //manzana
function initApples() {
    for (let i = 0; i <500; i++) {
        const position = {
            x: Math.floor(Math.random() * (worldWidth - 16)) + 8,
            y: Math.floor(Math.random() * (worldHeight - 16)) + 8
        };
        apples.push(new Apple(position, 8, "red", ctx));
    }
}

const apples = [];


const eatenApples = [];


function regenerateEatenApples() {
    eatenApples.forEach(apple => {
        apple.position = {
            x: Math.floor(Math.random() * (worldWidth - 16)) + 8,
            y: Math.floor(Math.random() * (worldHeight - 16)) + 8
        };
    });
    eatenApples.length = 0; // Limpiar la lista de manzanas comidas
}

// Iniciar el intervalo para regenerar cada 2 minutos (120000 milisegundos)
setInterval(regenerateEatenApples, 12000);

   
    
    
        // Clase Apple
        class Apple {
    constructor(position, radio, color, context) {
        this.position = position;
        this.radio = radio;
        this.color = color;
        this.context = context;
    }

    draw() {
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radio, 0, 2 * Math.PI);
        this.context.fillStyle = this.color;
        this.context.shadowColor = this.color;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }

    collision(snake) {
                   let v1 = {
        x: this.position.x - snake.position.x,
        y: this.position.y - snake.position.y
    };
    let distance = Math.sqrt((v1.x * v1.x) + (v1.y * v1.y));
    if (distance < snake.radio + this.radio) {
        this.position = {
            x: Math.floor(Math.random() * ((worldWidth - this.radio) - this.radio + 1)) + this.radio,
            y: Math.floor(Math.random() * ((worldHeight - this.radio) - this.radio + 1)) + this.radio,
        };
        snake.createBody();
        snake.createBody();
        scoreP++;
        score.textContent = scoreP;
        // Disminuir la velocidad de la serpiente y del boost
        snake.velocity = Math.max(snake.velocity - 0.01, 1.45); // Límite de velocidad normal en 1.45
        snake.boostVelocity = Math.max(snake.boostVelocity - 0.01, 1.9); // Límite de velocidad de boost en 1.8
    }
};






        }
    // Clase SnakeBody
        class SnakeBody {
    constructor(radio, color, context, path) {
        this.radio = radio;
        this.color = color;
        this.context = context;
        this.path = path;
        this.transparency = 1;
    }

    drawCircle(x, y, radio, color) {
        this.context.save();
        this.context.beginPath();
        this.context.arc(x, y, radio, 0, 2 * Math.PI);
        this.context.fillStyle = color;
        this.context.globalAlpha = this.transparency;
        this.context.shadowColor = this.color;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }

    draw() {
        this.drawCircle(this.path[0].x, this.path[0].y, this.radio, this.color);
    }
}



    
    // Otras partes de la clase `Snake`...

    
    
    // Clase Snake
        class Snake {
    constructor(position, radio, color, velocity, length, pathLength, context) {
        this.position = position;
        this.radio = 18; // Aumentamos el radio para que sea más gruesa
        this.color = color;
        this.velocity = velocity;
        this.context = context;
        this.rotation = 0;
        this.transparency = 1;
        this.body = [];
        this.isDeath = false;
        this.length = length;
        this.pathLength = pathLength;
        this.headPositions = [];
        this.segmentSpacing = 1; // Reducimos el espaciado entre segmentos
        this.keys = { A: false, D: false, enable: true };
        this.keyboard();
    }

    initBody() {
        for (let i = 0; i < this.length; i++) {
            let path = [];
            for (let k = 0; k < this.pathLength; k++) {
                path.push({
                    x: this.position.x,
                    y: this.position.y
                });
            }
            this.body.push(new SnakeBody(this.radio, this.color, this.context, path));
        }
    }

    


    

    

    


    
    

    

                
            
            
            


            drawCircle(x, y, radio, color, shadowColor) {
                this.context.save();
                this.context.beginPath();
                this.context.arc(x, y, radio, 0, 2 * Math.PI);
                this.context.fillStyle = color;
                this.context.globalAlpha = this.transparency;
                this.context.shadowColor = shadowColor;
                this.context.shadowBlur = 10;
                this.context.fill();
                this.context.closePath();
                this.context.restore();
            }
            createBody() {
    let path = [];
    for (let k = 0; k < this.pathLength; k++) {
        path.push({
            x: this.body.slice(-1)[0].path.slice(-1)[0].x,
            y: this.body.slice(-1)[0].path.slice(-1)[0].y
        });
    }
    let newRadio = Math.min(this.radio + 0.1, 60); // Limitar el aumento del radio hasta 60
    this.body.push(new SnakeBody(newRadio, this.color, this.context, path));
    
    // Actualizar el radio de todos los segmentos del cuerpo de la serpiente
    this.body.forEach(segment => {
        segment.radio = newRadio;
    });

    // Aumentar el radio de la cabeza de la serpiente
    this.radio = newRadio;
}

drawHead() {
    const eyeOffset = this.radio * 0.65; // Ajustar la posición de los ojos en relación al radio
    const pupilOffset = this.radio * 0.4; // Ajustar la posición de las pupilas en relación al radio
    const smallCircleOffset = this.radio * 0.2; // Ajustar el círculo blanco pequeño

    this.drawCircle(this.position.x, this.position.y, this.radio, this.color, this.color);
    
    // Ojo superior izquierdo
    this.drawCircle(this.position.x, this.position.y - eyeOffset, this.radio * 0.3, "white", "transparent");
    this.drawCircle(this.position.x + 1, this.position.y - eyeOffset, this.radio * 0.2, "black", "transparent");
    this.drawCircle(this.position.x + 3, this.position.y - eyeOffset + 1, this.radio * 0.1, "white", "transparent");
    
    // Ojo inferior izquierdo
    this.drawCircle(this.position.x, this.position.y + eyeOffset, this.radio * 0.3, "white", "transparent");
    this.drawCircle(this.position.x + 1, this.position.y + eyeOffset, this.radio * 0.2, "black", "transparent");
    this.drawCircle(this.position.x + 3, this.position.y + eyeOffset + 1, this.radio * 0.1, "white", "transparent");
}



            
           drawBody() {
    this.body[0].path.unshift({
        x: this.position.x,
        y: this.position.y
    });
    this.body[0].draw();
    for (let i = 1; i < this.body.length; i++) {
        this.body[i].path.unshift(this.body[i - 1].path.pop());
        this.body[i].draw();
    }
    this.body[this.body.length - 1].path.pop();
}


            
    draw() {
                this.context.save();
                this.context.translate(this.position.x, this.position.y);
                this.context.rotate(this.rotation);
                this.context.translate(-this.position.x, -this.position.y);
                this.drawHead();
                this.context.restore();
            }
          
            
            


    update() {
        
    if (this.isDeath) {
        this.transparency -= 0.02;
        if (this.transparency <= 0) {
            play = false;
            menu.style.display = "flex";
            return;
        }
    }

    // Movimiento y rotación de la cabeza
    if (snakeTargetAngle !== null) {
        this.rotation = smoothRotation(this.rotation, snakeTargetAngle, 0.03);
    }

    this.position.x += Math.cos(this.rotation) * this.velocity;
    this.position.y += Math.sin(this.rotation) * this.velocity;

    // Mantener historial de posiciones de la cabeza
    this.headPositions.unshift({ x: this.position.x, y: this.position.y });

    // Asegurarse de que solo guardamos suficientes posiciones para todos los segmentos
    if (this.headPositions.length > this.body.length * this.segmentSpacing) {
        this.headPositions.pop();
    }

    // Actualizar la posición de los segmentos del cuerpo
    for (let i = 0; i < this.body.length; i++) {
        const targetIndex = (i + 1) * this.segmentSpacing;
        if (this.headPositions[targetIndex]) {
            this.body[i].path[0] = this.headPositions[targetIndex];
        }
    }

    this.drawBody();
    this.draw();
};



// En la inicialización de la serpiente, aseguramos que la lista de posiciones esté vacía


    
    





    


            
            
            collision() {
    if (this.position.x - this.radio <= 0 || 
        this.position.x + this.radio >= worldWidth || 
        this.position.y - this.radio <= 0 || 
        this.position.y + this.radio >= worldHeight) {
        this.death();
    }
}

            
    
    death() {
        this.velocity = 0;
        this.keys.enable = false;
        this.isDeath = true;
        this.body.forEach((b) => {
            let lastItem = b.path[b.path.length - 1];
            for (let i = 0; i < b.path.length; i++) {
                b.path[i] = lastItem;
            }
            b.transparency = this.transparency;
        });

        // Mostrar mensaje de "Has muerto" con un botón para ir al menú principal
        const gameOverMessage = document.createElement("div");
        gameOverMessage.className = "game-over-message";
        gameOverMessage.innerHTML = `
            <p>Has muerto</p>
            <button onclick="window.location.href='http://tupaginaprincipal.com'">Menú Principal</button>
        `;
        document.body.appendChild(gameOverMessage);
    }


            drawCharacter() {
                for (let i = 1; i <= this.length; i++) {
                    this.drawCircle(
                        this.position.x - (this.pathLength * this.velocity * i),
                        this.position.y, this.radio, this.color, this.color
                    );
                }
                this.drawHead();
            }
            
            keyboard() {
                document.addEventListener("keydown", (evt) => {
                    if (evt.key === "a" || evt.key === "A") {
                        this.keys.A = true;
                    }
                    if (evt.key === "d" || evt.key === "D") {
                        this.keys.D = true;
                    }
                });
                document.addEventListener("keyup", (evt) => {
                    if (evt.key === "a" || evt.key === "A") {
                        this.keys.A = false;
                    }
                    if (evt.key === "d" || evt.key === "D") {
                        this.keys.D = false;
                    }
                });
            }
        }
    
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".score");
const canvas2 = document.getElementById("snake-1");
const canvas3 = document.getElementById("snake-2");
const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");

canvas2.width = 190;
canvas2.height = 80;
canvas3.width = 190;
canvas3.height = 80;
canvas.width = 850;
canvas.height = 980;

let play = false;
let scoreP = 0;
let snakeTargetAngle = null; // Inicializamos la variable aquí

const snake = new Snake({ x: 200, y: 200 }, 11, "#88FC03", 1.5, 8, 12, ctx); // Serpiente verde fosforescente
snake.initBody();

const snakeP1 = new Snake({ x: 165, y: 40 }, 11, "#88FC03", 1.5, 24, 4, ctx3); // Serpiente verde fosforescente
snakeP1.initBody();
snakeP1.drawCharacter();

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function init(length, pathLength) {
    const color = getRandomColor(); // Obtener un color aleatorio
    snake.body.length = 0;
    snake.color = color;
    snake.length = length;
    snake.pathLength = pathLength;
    snake.position = { x: 200, y: 200 };
    snake.isDeath = false;
    snake.velocity = 2.2; // Fijar la velocidad inicial aquí
    snake.transparency = 1;
    snake.initBody();
    snake.keys.enable = true;
    play = true;
    scoreP = 0;
    score.textContent = scoreP;
}

apples.length = 0; // Limpiar las manzanas anteriores
initApples(); // Inicializar nuevas manzanas

// Inicializar la serpiente automáticamente con un color aleatorio
init(8, 4);

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
    if (play) {
        snake.update();
        apples.forEach(apple => {
            apple.draw();
            apple.collision(snake);
        });
        updateView(snake);
    }
    requestAnimationFrame(update);
}

update();
const initialWidth = 1; // Definir el ancho inicial deseado


    function background() {
    ctx.fillStyle = "#1B1C30";
    ctx.fillRect(0, 0, worldWidth, worldHeight);

    for (let i = 0; i < worldHeight; i += 80) {
        for (let j = 0; j < worldWidth; j += 80) {
            ctx.fillStyle = "#1B1C30";
            ctx.fillRect(j, i, 80, 80);

            ctx.fillStyle = "#23253C";
            ctx.fillRect(j + 5, i + 5, 70, 70);
        }
    }
}

function background() {
    ctx.fillStyle = "#1B1C30"; // Color uniforme para todo el fondo
    ctx.fillRect(0, 0, worldWidth, worldHeight);
}

        
    function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
    if (play) {
        snake.update();
        apples.forEach(apple => {
            apple.draw();
            apple.collision(snake);
        });
        updateView(snake);
    }
    requestAnimationFrame(update);
}

snake.update = function() {
    if (this.isDeath) {
        this.transparency -= 0.02;
        if (this.transparency <= 0) {
            play = false;
            
            return;
        }
    }

    this.drawBody();
    this.draw();

    // Rotación suave si hay un ángulo objetivo
    if (snakeTargetAngle !== null) {
        this.rotation = smoothRotation(this.rotation, snakeTargetAngle, 0.03);
    }

    this.position.x += Math.cos(this.rotation) * this.velocity;
    this.position.y += Math.sin(this.rotation) * this.velocity;
    this.collision();
};

function smoothRotation(currentAngle, targetAngle, rotationSpeed) {
    let difference = targetAngle - currentAngle;
    if (difference > Math.PI) difference -= 2 * Math.PI;
    if (difference < -Math.PI) difference += 2 * Math.PI;
    if (Math.abs(difference) < rotationSpeed) return targetAngle;
    return currentAngle + Math.sign(difference) * rotationSpeed;
}



        update();
    // Control del joystick
        const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');
let touchStartX = 0;
let touchStartY = 0;
let joystickActive = false;

joystick.addEventListener('touchstart', (event) => {
    joystickActive = true;
    touchStartX =event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

joystick.addEventListener('touchmove', (event) => {
    if (!joystickActive) return;

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const diffX = touchX - touchStartX;
    const diffY = touchY - touchStartY;

    const angle = Math.atan2(diffY, diffX);
    const maxDistance = 40;
    const distance = Math.min(maxDistance, Math.sqrt(diffX * diffX + diffY * diffY));
    const limitedX = distance * Math.cos(angle);
    const limitedY = distance * Math.sin(angle);
    stick.style.transform = `translate(${limitedX}px, ${limitedY}px)`;

    // Establece el ángulo objetivo para que la serpiente gire gradualmente
    snakeTargetAngle = angle;
});

joystick.addEventListener('touchend', () => {
    joystickActive = false;
    snakeTargetAngle = null;
    stick.style.transform = 'translate(0, 0)';
});