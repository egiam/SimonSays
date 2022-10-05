const round = document.getElementById("round");
const simonButton = document.getElementsByClassName("square");
const startButton = document.getElementById("startButton");

class Simon {
    constructor(simonButton, startButton, round) {
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 15;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButton);
        this.display = {
            startButton,
            round,
        };
        this.errorSound = new Audio("./sounds/error.wav");
        this.buttonSounds = [
            new Audio("./sounds/1.mp3"),
            new Audio("./sounds/2.mp3"),
            new Audio("./sounds/3.mp3"),
            new Audio("./sounds/4.mp3"),
        ];
    }

    // Metodos
    //Inicia el Simon
    init() {
        this.display.startButton.onclick = () => this.startGame();
    }

    //Inicia el juego
    startGame() {
        this.display.startButton.disabled = true;
        this.updateRound(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove("winner");
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

    //Actualiza el round y el display
    updateRound(value) {
        this.round = value;
        this.display.round.textContent = `Round: ${this.round}`;
    }

    //Crea el array aleatorio de botones
    createSequence() {
        return Array.from({ length: this.totalRounds }, () =>
            this.getRandomColor()
        );
    }

    //Devuelve un numero aleatorio entre 0 y 3
    getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

    //Ejecuta una funcion cuando se hace click en un boton
    buttonClick(value) {
        !this.blockedButtons && this.validateChosenColor(value);
    }

    //Valida si el boton que toca el usuario corresponde al valor de la secuencia
    validateChosenColor(value) {
        if (this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].play();
            if (this.round === this.userPosition) {
                this.updateRound(this.round + 1);
                if (this.round >= 10) this.speed /= 1.05;
                else this.speed /= 1.15;
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.gameLost();
        }
    }

    //Verifica que no haya acabado el juego
    isGameOver() {
        if (this.round === this.totalRounds) {
            this.gameWon();
        } else {
            this.userPosition = 0;
            this.showSequence();
        }
    }

    //Muestra la secuencia de botones
    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            this.toggleButtonStyle(button);
            setTimeout(() => this.toggleButtonStyle(button), this.speed / 2);
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

    //Pinta los botones para cuando se esta mostrando la secuencia
    toggleButtonStyle(button) {
        button.classList.toggle("active");
    }

    //Cuando el jugador pierde
    gameLost() {
        this.speed = 1000;
        this.errorSound.play();
        this.display.startButton.disabled = false;
        this.blockedButtons = true;
    }

    //Cuando el jugador gana
    gameWon() {
        this.speed = 1000;
        this.display.startButton.disabled = false;
        this.blockedButtons = true;
        this.buttons.forEach((element) => element.classList.add("winner"));
        this.updateRound("You Win! 🏆");
    }
}

const simon = new Simon(simonButton, startButton, round);
simon.init();

// JS