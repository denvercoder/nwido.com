// create a new scene
let gameScene = new Phaser.Scene('Game')

// some parameters for our scene
gameScene.init = function() {
  this.playerSpeed = 150
  this.jumpSpeed = -600
}

// load asset files for our game
gameScene.preload = function() {
  // load images
  this.load.image('ground', 'assets/images/ground.png')
  this.load.image('platform', 'assets/images/platform.png')
  this.load.image('block', 'assets/images/block.png')
  this.load.image('goal', 'assets/images/gorilla3.png')
  this.load.image('barrel', 'assets/images/barrel.png')

  // load spritesheets
  this.load.spritesheet('player', 'assets/images/player_spritesheet.png', {
    frameWidth: 28,
    frameHeight: 30,
    margin: 1,
    spacing: 1
  })

  this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', {
    frameWidth: 20,
    frameHeight: 21,
    margin: 1,
    spacing: 1
  })
}

// executed once, after assets were loaded
gameScene.create = function() {
  this.physics.world.bounds.width = 360
  this.physics.world.bounds.height = 700

  this.platforms = this.add.group()

  let ground = this.add.sprite(180, 604, 'ground')
  this.physics.add.existing(ground, true)
  this.platforms.add(ground)

  let platform = this.add.tileSprite(180, 500, 4 * 36, 30, 'block')
  this.physics.add.existing(platform, true)
  this.platforms.add(platform)

  this.player = this.add.sprite(180, 400, 'player', 3)
  this.physics.add.existing(this.player)

  this.player.body.setCollideWorldBounds(true)

  this.anims.create({
    key: 'walking',
    frames: this.anims.generateFrameNames('player', {
      frames: [0, 1, 2]
    }),
    frameRate: 12,
    yoyo: true,
    repeat: -1
  })

  this.physics.add.collider(this.player, this.platforms)

  this.cursors = this.input.keyboard.createCursorKeys()
}

gameScene.update = function() {
  let onGround = this.player.body.blocked.down || this.player.body.touching.down

  if (this.cursors.left.isDown) {
    this.player.flipX = false
    this.player.body.setVelocityX(-this.playerSpeed)
    if (onGround && !this.player.anims.isPlaying)
      this.player.anims.play('walking')
  } else if (this.cursors.right.isDown) {
    this.player.flipX = true
    this.player.body.setVelocityX(this.playerSpeed)
    if (onGround && !this.player.anims.isPlaying)
      this.player.anims.play('walking')
  } else {
    this.player.body.setVelocityX(0)
    this.player.anims.stop('walking')
    if (onGround) this.player.setFrame(3)
  }

  if (onGround && (this.cursors.space.isDown || this.cursors.up.isDown)) {
    this.player.body.setVelocityY(this.jumpSpeed)

    this.player.anims.stop('walking')

    this.player.setFrame(2)
  }
}

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: 'Donkey Klone',
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: true
    }
  }
}

// create the game, and pass it the configuration
let game = new Phaser.Game(config)
