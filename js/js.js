const el22 = document.querySelector('.c2');
const h = 30;
let stack = [];

const gridColor = 'lightblue';
const snakeColor = 'black';
const targetColor = 'yellow';
const alertColor = 'red';

let isGameStop = false;

el22.style.backgroundColor = '';
el22.style.lineHeight = '0';

const gridX = 15;
const gridY = 15;

let result = 0;
const banner = document.querySelector('.container.common');
banner.style.fontSize = '35px';
banner.style['text-align'] = 'center';
banner.style['vertical-align'] = 'middle';
banner.style['line-height'] = '90px';

function createEl() {
    const d = document.createElement('div');

    d.style.width = h + 'px';
    d.style.height = h + 'px';
    d.style.backgroundColor = gridColor;
    d.style.display = 'inline-block';
    d.style.margin = '0px';
    d.style.padding = '0px';
    d.style.border = '1px solid lightgreen';
    d.classList.add('cell');

    return d;
}

function composeStack(xCount = 10, yCount = 10) {
    let counter = 0;
    for (let i = 0; i < yCount; i++) {
        for (let i1 = 0; i1 < xCount; i1++) {
            if (stack[i] == undefined) {
                stack[i] = [];
            }
            stack[i][i1] = {
                id: counter++,
                cords: {
                    x: i1,
                    y: i,
                },
                siblings: {
                    left: null,
                    top: null,
                    right: null,
                    bottom: null,
                },
                el: createEl()
            };
        }
    }
}


function setSiblings() {
    for (const [kX, i] of stack.entries()) {

        for (const [kY, cell] of i.entries()) {
            let x = cell.cords.x
            let y = cell.cords.y

            // top
            stack[kX][kY].siblings.top = getCell(x, y - 1);
            // left
            stack[kX][kY].siblings.left = getCell(x - 1, y);
            // right
            stack[kX][kY].siblings.right = getCell(x + 1, y);
            // bottom
            stack[kX][kY].siblings.bottom = getCell(x, y + 1);
        }
    }
}

function getCellKeys(cellId) {
    for (const [rowKey, row] of stack.entries()) {
        for (const [cellKey, cell] of row.entries()) {
            if (cell.id == cellId) {
                return [rowKey, cellKey];
            }
        }
    }
}

function getCell(cordX, cordY) {

    for (let i of stack) {
        for (let i2 of i) {
            if (i2.cords.y == cordY && i2.cords.x == cordX) {
                return i2;
            }
        }
    }
    return null;
}

function draw() {
    for (let row of stack) {
        for (let cell of row) {
            cell.el.setAttribute('object-id', cell.id);
            el22.append(cell.el)
        }

        const br = document.createElement('br');
        el22.append(br)
    }
}

function setInitialCell() {
    snake.push(stack[0][0]);
}

function transition(event) {

    if (isGameStop) {
        return;
    }

    const eventMap = {
        up: 'top',
        left: 'left',
        right: 'right',
        down: 'bottom',
    }

    const firstInSnake = snake[0];

    if (firstInSnake.siblings[eventMap[event]]) {

        const newFirst = firstInSnake.siblings[eventMap[event]];
        snake.unshift(newFirst)

        handleSnakeBodyTouched();

        const firstElement = document.querySelector("[object-id='" + newFirst.id + "']");
        firstElement.style.backgroundColor = snakeColor;

        if (targetCell.id == firstInSnake.id) {
            setTarget();
        } else {
            const lastInSnake = snake.pop();

            const lastElement = document.querySelector("[object-id='" + lastInSnake.id + "']");
            lastElement.style.backgroundColor = gridColor;
        }

        return;
    }

    stopGame();

}

function setTarget() {

    let targetX = Math.floor(Math.random() * gridX);
    let targetY = Math.floor(Math.random() * gridY);

    targetCell = getCell(targetX, targetY);

    let isTargetInSnake = false;

    for (const snakeElement of snake) {
        if (snakeElement.id == targetCell.id) {
            isTargetInSnake = true;
            setTarget();
            break;
        }
    }

    if (isTargetInSnake) {
        return;
    }

    banner.innerHTML = ++result;

    const target = document.querySelector("[object-id='" + targetCell.id + "']");
    target.style.backgroundColor = targetColor;
}

function handleSnakeBodyTouched() {

    if (snake.length < 2) {
        return;
    }

    const first = snake[0];

    let isSnakeTouched = false;

    for (const [key, snakeElement] of snake.entries()) {
        if (key > 0 && snakeElement.id == first.id) {
            isSnakeTouched = true;
            break;
        }
    }

    if (!isSnakeTouched) {
        return;
    }

    stopGame();
}

function stopGame() {

    isGameStop = true;

    const el = document.querySelector('body');
    el.style.backgroundColor = alertColor;
}

let targetCell;
let snake = new Array();

composeStack(gridX, gridY);
setSiblings();
draw();
setTarget();
setInitialCell();

for (const el of document.querySelectorAll('.cell')) {
    el.addEventListener('click', function (event) {
        const id = event.target.getAttribute('object-id');
        console.log(id);
        cellKeys = getCellKeys(id);
        console.log(cellKeys[0], cellKeys[1]);
    });
}

document.onkeydown = checkKey;

let lastEvent = null;

function checkKey(e) {

    e = e || document.event;

    let event;

    if (e.key == 'ArrowUp') {
        event = 'up';
    } else if (e.key == 'ArrowDown') {
        event = 'down';
    } else if (e.key == 'ArrowLeft') {
        event = 'left';
    } else if (e.key == 'ArrowRight') {
        event = 'right'
    }

    if (lastEvent && snake.length > 1) {
        if (event == 'up' && lastEvent == 'down') {
            return;
        }

        if (event == 'down' && lastEvent == 'up') {
            return;
        }

        if (event == 'left' && lastEvent == 'right') {
            return;
        }

        if (event == 'right' && lastEvent == 'left') {
            return;
        }
    }

    if (event) {

        time = 0;
        transition(event);

        lastEvent = event;
    }
}

const FRAME_PERIOD = 20;
let time = 0;

function step() {
    setTimeout(function () {

        if (time++ > FRAME_PERIOD) {
            time = 0;

            transition(lastEvent);

            window.requestAnimationFrame(step);
            return;
        }
        step();
    }, 1)
}

lastEvent = 'right';

const starterBanner = document.createElement('div');
starterBanner.style.height = '100%';
starterBanner.style.width = '100%';
starterBanner.style.backgroundColor = 'lightblue';
starterBanner.style.position = 'absolute';
starterBanner.style.top = '0';
starterBanner.style.left = '0';
starterBanner.style.opacity = '0.8';
starterBanner.style.display = 'flex';
starterBanner.style['justify-content'] = 'center';
starterBanner.style['align-items'] = 'center';

const msg = document.createElement('p')
msg.style.fontSize = '20em';
msg.style.color = 'blue';

starterBanner.appendChild(msg);

const bodyEl = document.querySelector('body');
bodyEl.append(starterBanner);

let starterCounter = 4;

function starter(){

    if(--starterCounter < 1){
        msg.style.fontSize = '10em';
        msg.textContent = 'Goooooo!';
    } else {
        msg.textContent = starterCounter;
    }

    setTimeout(function(){

        if(starterCounter < 1){
            starterBanner.style.opacity = 0;

            window.requestAnimationFrame(step);

        } else {
            starter();
        }
    }, 1000);

}

starter();