const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, framesCurrent = 0, framesElapsed = 0, framesHold = 15, offset = {x: 0, y: 0} }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = framesCurrent
        this.framesElapsed = framesElapsed
        this.framesHold = framesHold
        this.offset = offset
    }

    draw() {
        c.drawImage(this.image, this.framesCurrent * (this.image.width / this.framesMax), 0, this.image.width / this.framesMax, this.image.height, this.position.x -this.offset.x, this.position.y - this.offset.y, (this.image.width / this.framesMax) * this.scale, this.image.height * this.scale)
    }

    animateFrames() {
        this.framesElapsed++

     if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
           this.framesCurrent++
     }  else {
        this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({position,velocity, color = 'red', imageSrc, scale = 1, framesMax = 1, framesCurrent = 0, framesElapsed = 0, framesHold = 15, offset = {x: 0, y: 0} , sprites }) {
        super({
           position,
           imageSrc,
           scale,
           framesMax,
           framesCurrent,
           framesElapsed,
           framesHold,
           offset
        })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        console.log(this.sprites)
    }

    update() {
        this.draw()
        this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
    switchSprite (sprite) {
        switch (sprite) {
          case 'idle':
            if (this.image !== this.sprites.idle.image) {
            this.image = this.sprites.idle.image
            this.framesMax = this.sprites.idle.framesMax
            this.framesCurrent = 0
            }
          break
          case 'run':
            if (this.image != this.sprites.run.image) {
            this.image = this.sprites.run.image
            this.framesMax = this.sprites.run.framesMax
            this.framesCurrent = 0
            }
          break
          case 'jump':
            if (this.image !== this.sprites.jump.image) {
            this.image = this.sprites.jump.image
            this.framesMax = this.sprites.jump.framesMax
            this.framesCurrent = 0
            }
          break
          case 'fall':
            if (this.image !== this.sprites.fall.image) {
            this.image = this.sprites.fall.image
            this.framesMax = this.sprites.fall.framesMax
            this.framesCurrent = 0
            }
          break
        }
    }
}
const background = new Sprite ({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/background.png'
})

const shop = new Sprite ({
    position: {
        x: 600,
        y: 160
    },
    imageSrc: './Assets/shop.png',
    scale: 2.5,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/samuraiSprite/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './Assets/samuraiSprite/Idle.png',
            framesMax: 8, 
        },
        run: {
            imageSrc: './Assets/samuraiSprite/Run.png',
            framesMax: 8, 
        },
        jump: {
            imageSrc: './Assets/samuraiSprite/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/samuraiSprite/Fall.png',
            framesMax: 2
        }
    }
})

const enemy = new Fighter({
    position: {
    x: 400,
    y: 100
},
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
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
    },
    ArrowUp: {
        pressed: false
    }, 
    ArrowDown: {
        pressed: false
    }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie'
     } else if (player.health > enemy.health) {
         document.querySelector('#displayText').innerHTML = 'Player 1 wins'
     } else if (player.health < enemy.health) {
         document.querySelector('#displayText').innerHTML = 'Player 2 wins'
     }
}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
   
    if (timer === 0) {
        determineWinner({player, enemy})
  }    
}

decreaseTimer()
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width, canvas.height)
    background.update() 
    shop.update()   
    player.update()
   // enemy.update()

    player.velocity.x = 0 
    enemy.velocity.x = 0

    //Player Movement 

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -3
        player.switchSprite('run')
    
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 3
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')     
    } 
    //jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
      player.switchSprite('fall')
    }
    //Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -3
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 3
    }

    // Detect Collisions
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
    player.isAttacking
     ) {
    player.isAttacking = false
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'     
    }

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
    enemy.isAttacking
     ) {
    enemy.isAttacking = false 
    player.health -= 20      
    document.querySelector('#playerHealth').style.width = player.health + '%'     
    }
   //end game based on health 

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy,timerId})
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
            keys.w.pressed = true
            player.velocity.y = -20
            break 
        case ' ':
            player.attack()
            break
            //Player 2
            case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            enemy.velocity.y = -20
            break  
        case 'ArrowDown':
            enemy.isAttacking = true
            break             
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
        case 'w':
            keys.w.pressed = false
            lastKey = 'w'
            break  

        //Player 2
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            enemy.lastKey = 'ArrowRight'
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            enemy.velocity.y = -10
            break                                 
        }
})