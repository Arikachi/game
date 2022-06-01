const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024 * 1.2
canvas.height = 576 * 1.2

c.fillRect(0, 0, canvas.width, canvas.height)

// canvas.style.backgroundImage = 'D:\jsi08\game\d5943460d6ec066d83a9838745df7742.jpg'

let gravity = 0.7
class Sprite {
    constructor({position, velocity, color = 'red', offset, offset2, offset3}){
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: offset,
            width: 100,
            height: 50,
        }
        this.defendBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset2: offset2,
            width: 50,
            height: 100,
        }
        this.rangeBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset3: offset3,
            width: 500,
            height: 50,
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.isDefending = false
        this.isFiring = false
    }

    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attack box
        if (this.isAttacking){
        c.fillStyle = 'green'
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }

        if (this.isFiring){
            c.fillStyle = 'orange'
            c.fillRect(this.rangeBox.position.x, this.rangeBox.position.y, this.rangeBox.width, this.rangeBox.height)
        }

        if(this.isDefending){
        c.fillStyle = 'yellow'
        c.fillRect(this.defendBox.position.x, this.defendBox.position.y, this.defendBox.width, this.defendBox.height)
        }
    }

    update(){
        this.draw()
        if(this.velocity.x < 0) {
            this.attackBox.position.x = this.position.x - 50
            this.attackBox.position.y = this.position.y
        } else if(this.velocity.x > 0){
            this.attackBox.position.x = this.position.x
            this.attackBox.position.y = this.position.y
        } else{
            this.attackBox.position.x = this.position.x - 25
            this.attackBox.position.y = this.position.y
        }

        if(this.velocity.x < 0) {
            this.rangeBox.position.x = this.position.x - 450
            this.rangeBox.position.y = this.position.y
        } else if(this.velocity.x > 0){
            this.rangeBox.position.x = this.position.x
            this.rangeBox.position.y = this.position.y
        } else{
            this.rangeBox.position.x = this.position.x - 225
            this.rangeBox.position.y = this.position.y
        }

        this.defendBox.position.x = this.position.x + this.defendBox.offset2.x
        this.defendBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else if (this.position.y < 0){
            this.velocity.y = 10
        } else{
            this.velocity.y += gravity
        }
    }

    //attack
    attack() {
        if(this.isDefending == false) {
            this.isAttacking = true
            setTimeout(() => {
                this.isAttacking = false
            }, 100)
        }
    }

    rangeAttack() {
        if(this.isDefending == false){
            this.isFiring = true
            setTimeout(() => {
                this.isFiring = false
            }, 100)
        }
    }

    //defend
    defend() {
        if(this.isAttacking == false && this.isFiring == false && this.isDefending == false){
            this.isDefending = true
            setTimeout(() => {
                this.isDefending = false
            }, 1000)
        }
    }

    //dash
    dash() {
        if(this.velocity.x < 0){
            if(this.position.x > 150){
                this.position.x += -150
            }
        } else if(this.velocity.x > 0){
            this.position.x += 150
        } else{
            this.position.y -= 200
        }
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    offset2: {
        x: 25,
        y: 0
    },
    offset3: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: canvas.width - 50,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    offset2: {
        x: -25,
        y: 0
    },
    offset3: {
        x: -50,
        y: 0
    },
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        if(player.health == 100){
            document.querySelector('#displayText').innerHTML = 'Perfect'
        } else{
            document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
        }
    } else if (player.health < enemy.health) {
        if(enemy.health == 100){
            document.querySelector('#displayText').innerHTML = 'Perfect'
        } else{
            document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
        }
    }
}

let timer = 60
let timerId
function decreaseTimer(){
    if (timer>0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a' && player.position.x > 0){
        player.velocity.x = -7
    } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x < canvas.width - player.width){
        player.velocity.x = 7
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x > 0){
        enemy.velocity.x = -7
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x < canvas.width - player.width){
        enemy.velocity.x = 7
    }

    //detect collision
    if (
        player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
        player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + enemy.height &&
        player.isAttacking &&
        enemy.isDefending == false
        ) {
        player.isAttacking = false
        if(enemy.health > 0 && player.health > 0 && timer > 0){
            enemy.health -= 10
        }
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        player.rangeBox.position.x + player.rangeBox.width >= enemy.position.x &&
        player.rangeBox.position.x <= enemy.position.x + enemy.width &&
        player.rangeBox.position.y + player.rangeBox.height >= enemy.position.y &&
        player.rangeBox.position.y <= enemy.position.y + enemy.height &&
        player.isFiring &&
        enemy.isDefending == false
        ) {
        player.isFiring = false
        if(enemy.health > 0 && player.health > 0 && timer > 0){
            enemy.health -= 5
        }
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        enemy.attackBox.position.x + enemy.attackBox.width >= player.position.x &&
        enemy.attackBox.position.x <= player.position.x + player.width &&
        enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y &&
        enemy.attackBox.position.y <= player.position.y + player.height &&
        enemy.isAttacking &&
        player.isDefending == false
        ) {
        enemy.isAttacking = false
        if(enemy.health > 0 && player.health > 0 && timer > 0){
            player.health -= 10
        }
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if (
        enemy.rangeBox.position.x + enemy.rangeBox.width >= player.position.x &&
        enemy.rangeBox.position.x <= player.position.x + player.width &&
        enemy.rangeBox.position.y + enemy.rangeBox.height >= player.position.y &&
        enemy.rangeBox.position.y <= player.position.y + player.height &&
        enemy.isFiring &&
        player.isDefending == false
        ) {
        enemy.isFiring = false
        if(enemy.health > 0 && player.health > 0 && timer > 0){
            player.health -= 5
        }
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case 's':
            player.defend()
            break
        case 'j':
            player.attack()
            break
        case 'l':
            player.dash()
            break
        case 'u':
            player.rangeAttack()
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
    
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.defend()
            break
        case '1':
            enemy.attack()
            break
        case '3':
            enemy.dash()
            break
        case '4':
            enemy.rangeAttack()
            break
            
        case 'r':
            window.location.reload()
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})

