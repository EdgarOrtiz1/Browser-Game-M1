// Many parts of the code will be differnt due to many complications when following the reference 
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width, canvas.height)

const gravity = 0.7
// this sprite class is what creates the frame change which in turns animates the images 
// that is why we add these to the fighting class since the characters must loop through frames 

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
        c.drawImage(this.image, this.framesCurrent * (this.image.width / this.framesMax), 0, this.image.width / this.framesMax, this.image.height, this.position.x - this.offset.x, this.position.y - this.offset.y, (this.image.width / this.framesMax) * this.scale, this.image.height * this.scale)
    }
// this is where we are loopingf through the frames 
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
// this is where we call the functions within the function in order for it to loop
    update() {
        this.draw()
        this.animateFrames()
    }
}
// creating the character and adding the values of our sprite class in order to pull the animation properties we want to use for our sprites as welll 
// i also declared constants to the properties i listed 
// the ones that would changes i referenced as themselves within the constructor
// this helped as well later on when calling certain properties in order to render animations 
class Fighter extends Sprite {
    constructor({position,velocity, color = 'red', imageSrc, scale = 1, framesMax = 1, framesCurrent = 0, framesElapsed = 0, framesHold = 15, offset = {x: 0, y: 0} , sprites, attackBox = {offset: {}, width: undefined, height: undefined }}) {
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
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image() 
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }
// here we are establishing the hit boxes for the characters aswell as keeping them with the characters instead of floating around 
    update() {
        this.draw()

        if (!this.dead) this.animateFrames()
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += gravity
    }
// adding the second attack required me to add a new button aswell as new event listerns and conditionals 
// however i managed to get it to run and work 
    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
    }
    attack2() {
        this.switchSprite('attack2')
        this.isAttacking = true      
    }  
   
    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }
   // these if statements are what help swap the sprites depending on whats goin on 
   // they are also returning themselves in order to switch back to the default idle stage or reset their frames back to 0
   // we are always going back to 0 frames since thats the beggining of all the sprites frames  
    switchSprite (sprite) {
        if (this.image === this.sprites.death.image) {
           if (this.framesCurrent === this.sprites.death.framesMax - 1) this.dead = true
            return}

       if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) 
       
       return
       
       if (this.image === this.sprites.attack2.image && this.framesCurrent < this.sprites.attack2.framesMax - 1) 
       
       return

        if(this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1)
        
        return

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
          case 'attack1':
            if (this.image !== this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image
            this.framesMax = this.sprites.attack1.framesMax
            this.framesCurrent = 0
            }
          break
          case 'attack2':
            if (this.image !== this.sprites.attack2.image) {
            this.image = this.sprites.attack2.image
            this.framesMax = this.sprites.attack2.framesMax
            this.framesCurrent = 0
            }
          break
          case 'takeHit':
            if (this.image !== this.sprites.takeHit.image) {
            this.image = this.sprites.takeHit.image
            this.framesMax = this.sprites.takeHit.framesMax
            this.framesCurrent = 0
            }
          break
          case 'death':
            if (this.image !== this.sprites.death.image) {
            this.image = this.sprites.death.image
            this.framesMax = this.sprites.death.framesMax
            this.framesCurrent = 0
            }
          break
        }
    }
}
// setting the background for the game 
const background = new Sprite ({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/background.png'
})
// setting up a shop image with the properties of Sprite in order for it to animate or loop through each frame
const shop = new Sprite ({
    position: {
        x: 600,
        y: 160
    },
    imageSrc: './Assets/shop.png',
    scale: 2.5,
    framesMax: 6
})
// here we set the propteries again to the right presets from our constructor calls in the fighting class above 
const player = new Fighter ({
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
        },
        attack1: {
            imageSrc: './Assets/samuraiSprite/Attack1.png',
            framesMax: 6
        },
        attack2: {
            imageSrc: './Assets/samuraiSprite/Attack2.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './Assets/samuraiSprite/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './Assets/samuraiSprite/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
     offset:{   
        x: 100,
        y: 50
    },
    width: 155,
    height : 50
}
})
// here we do the same for our enemy 
const enemy = new Fighter ({
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
    },
    imageSrc: './Assets/Urokodaki/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './Assets/Urokodaki/Idle.png',
            framesMax: 4, 
        },
        run: {
            imageSrc: './Assets/Urokodaki/Run.png',
            framesMax: 8, 
        },
        jump: {
            imageSrc: './Assets/Urokodaki/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/Urokodaki/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Assets/Urokodaki/Attack1.png',
            framesMax: 4
        },
        attack2: {
            imageSrc: './Assets/Urokodaki/Attack2.png',
            framesMax: 4 
         }, 
        takeHit: {
           imageSrc: './Assets/Urokodaki/Take hit.png',
           framesMax: 3 
        }, 
        death: {
           imageSrc: './Assets/Urokodaki/Death.png',
           framesMax: 7 
        }
    },
    attackBox: {
        offset:{   
           x: -185,
           y: 50
       },
       width: 185,
       height : 50
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
    },
    p: {
       pressed: false
   },
    q: {
    pressed: false
   }  
}
// this is where we start detecting collisios 
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}
// here we have the statement that will render depending on the outcome 
// player 1 and player 2 are not listed on the index.html file
// the reason why is that the else if statements will render the text we give it if it meets the conditions 

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
// setting a clock animation 
// we then make the timer countdown every 1 second until it is no longer greater than 0 
// we add the determine winner function to state if the game ends and the game will determine the winnner based on those conditions 
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
// here we call the funtions in order for them to continue to run 
decreaseTimer()
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width, canvas.height)
    background.update() 
    shop.update()   
    player.update()
    enemy.update()

    player.velocity.x = 0 
    enemy.velocity.x = 0

// Player Movement 
// This will push the sprite to change
// I have conditionals set to track if they same key is pressed and and released then the switch sprite funnction will be called 
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -3
        player.switchSprite('run')
    
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 3
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')     
    } 
// jump
// this functiona;ity will keep 
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
      player.switchSprite('fall')
    }
    //Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -3
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 3
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')     
    } 
    //Enemy Jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite('fall')
    }
    // Detect Collisions & taking damage 
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
    player.isAttacking && player.framesCurrent === 4
     ) {
    enemy.takeHit()
    player.isAttacking = false

    document.querySelector('#enemyHealth').style.width = enemy.health + '%'     
    }

    //If player Misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
    enemy.isAttacking && enemy.framesCurrent === 2
     ) {
    player.takeHit()
    enemy.isAttacking = false 

    document.querySelector('#playerHealth').style.width = player.health + '%'     
    }
   
    //If enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }
// conditional to end game if 
// end game based on health 
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
 }
 
//claling the animate tag in order for it to run 
animate()
// key press
// this eventListener helps the code break or pause in between each change in sprite/ key input
// this is also stating the dead animation will prevent any other movement if the player/enemy is dead 
// by its corresponding character 
window.addEventListener('keydown', (event) => {
    if (!player.dead) {
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
        case 'q':
            player.attack2()
            break
    }
    }
            //Player 2
    if(!enemy.dead){
        switch(event.key) {
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
                enemy.attack()
                break
            case 'p':
                 enemy.attack2()
                break 
        }         
    }

})
// Key release 
// this is where we can track when we lift up our fingers from the keys in order to properly start the next movement 
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
// Player 2 functionality, we dont have to listen for  the attack buttons because another function will be tracking those inputs 
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