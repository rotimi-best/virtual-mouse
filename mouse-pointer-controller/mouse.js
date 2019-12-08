// Documentation: http://getrobot.net/api/mouse.html#GetPos
const robot = require("robot-js");
const io = require('socket.io-client');
const socket = io("https://rotimi-best-fluttersocket.glitch.me")

const mouse = robot.Mouse();
const mousePos = robot.Mouse.getPos();

console.log('starting mouse script')
console.log('mouse position is: ', mousePos)

let nextX = mousePos.x
let nextY = mousePos.y
let maxX = 1365 // width of my laptop. TODO: Automatically calculate this
let maxY = 767 // height of my laptop. TODO: Automatically calculate this
let touchpadX = 0
let touchpadY = 0
const ratio = 5
let clickable = true

// Move mouse listener
socket.on('touchmove', function (msg) {
    clickable = false;
    const position = JSON.parse(JSON.stringify(msg))
        // io.emit('touchmove', position);

    // X
    if (position.x > touchpadX) {
        const next = nextX + ratio;
        console.log('x is greater', next)

        nextX = next > maxX ? maxX : next;
    } else if (position.x < touchpadX) {
        const next = nextX - ratio;
        console.log('x is lesser', next)

        nextX = next <= 0 ? 0 : next;
    }

    // Y
    if (position.y > touchpadY) {
        const next = nextY + ratio;
        console.log('y is greater', next)

        nextY = next > maxY ? maxY : next;
    } else if (position.y < touchpadY) {
        const next = nextY - ratio;
        console.log('y is lesser', next)

        nextY = next <= 0 ? 0 : next;
    }


    robot.Mouse.setPos(nextX, nextY)
    touchpadX = position.x;
    touchpadY = position.y;

    console.log('touchmove: ', position);
    console.log('next: ', { nextX, nextY});
})

// Click listener
socket.on("clickpress", () => {
    setTimeout(() => {
        if (clickable) {
            mouse.press(robot.BUTTON_LEFT)

            mouse.release(robot.BUTTON_LEFT)
        }
    }, 100)
})

socket.on("clickrelease", () => {
    clickable = true
})

