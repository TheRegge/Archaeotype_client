import Phaser from 'phaser'
import Player from '../classes/Player'
import Minimap from '../classes/Minimap'
import ATGrid from '../classes/ATGrid'
import Ruler from '../classes/Ruler'
import OriginButton from '../classes/OriginButton'

import {
  TILE_SIZE,
  NUM_TILES_HEIGHT,
  NUM_TILES_WIDTH,
  MINIMAP,
  PLAYER_SPEED,
  WORLD,
  VIEWPORT,
  COLOR_HINT_PRIMARY,
} from '../main'

export default class SiteScene extends Phaser.Scene {
  private minimap
  public player
  private cursors
  private grid
  private rulerH
  private rulerV
  private originButton
  private minimapFrame

  constructor() {
    super({ key: 'site' })
  }

  preload() {
    // Assets for this scene are preloaded
    // in the previous scene (LoadingScene)
  }

  create() {
    this.add
      .image(0, 0, 'terrain')
      .setPosition(
        WORLD.width / 2 + WORLD.origin.x,
        WORLD.height / 2 + WORLD.origin.y
      )
    const ignoredByMainCam: Phaser.GameObjects.GameObject[] = []
    const ignoredByMinimap: Phaser.GameObjects.GameObject[] = []
    this.cursors = this.input.keyboard.createCursorKeys()

    this.physics.world.setBounds(
      WORLD.origin.x,
      WORLD.origin.y,
      WORLD.width,
      WORLD.height
    )
    this.setupMainCam()

    this.grid = this.createGrid()
    this.add.existing(this.grid)
    ignoredByMinimap.push(this.grid)

    this.minimap = this.createMinimap()

    this.cameras.addExisting(this.minimap)

    this.createRulers()
    ignoredByMinimap.push(this.rulerH)
    ignoredByMinimap.push(this.rulerV)
    ignoredByMinimap.push(this.originButton)

    this.player = Player.getInstance(this, VIEWPORT.width, VIEWPORT.height)
    ignoredByMainCam.push(this.player)

    const strokeWidth = 120
    this.minimapFrame = new Phaser.GameObjects.Rectangle(
      this,
      WORLD.origin.x + strokeWidth / 2,
      WORLD.origin.y + strokeWidth / 2,
      WORLD.width - strokeWidth,
      WORLD.height - strokeWidth
    )
    this.minimapFrame.setStrokeStyle(strokeWidth, 0xffffff, 0.5)
    this.minimapFrame.setOrigin(0, 0)
    this.add.existing(this.minimapFrame)

    ignoredByMainCam.push(this.minimapFrame)

    this.cameras.main.ignore(ignoredByMainCam)
    this.minimap.ignore(ignoredByMinimap)
    this.cameras.main.startFollow(this.player, false, 0.05, 0.05)
  }

  update() {
    this.player.body.setVelocity(0)
    let speed = PLAYER_SPEED

    if (this.cursors.shift.isDown) {
      speed *= 4
    }

    if (this.cursors.left.isDown) {
      this.player.moveLeft(speed)
    } else if (this.cursors.right.isDown) {
      this.player.moveRight(speed)
    }

    if (this.cursors.up.isDown) {
      this.player.moveUp(speed)
    } else if (this.cursors.down.isDown) {
      this.player.moveDown(speed)
    }
  }

  setupMainCam = () => {
    this.cameras.main
      .setBounds(WORLD.origin.x, WORLD.origin.y, WORLD.width, WORLD.height)
      .setName('main')
    this.cameras.main.setViewport(
      WORLD.origin.x,
      WORLD.origin.y,
      VIEWPORT.width,
      VIEWPORT.height
    )

    this.cameras.main.scrollX = WORLD.origin.x
    this.cameras.main.scrollY = WORLD.origin.y
    this.cameras.main.setBackgroundColor(0xdddddd)
  }

  createMinimap = () => {
    return new Minimap(
      WORLD.origin.x + VIEWPORT.width - WORLD.innerPadding - MINIMAP.width,
      WORLD.origin.y + WORLD.innerPadding * 2,
      MINIMAP.width,
      MINIMAP.height,
      this
    )
  }

  createGrid = () => {
    return new ATGrid(
      this,
      WORLD.origin.x,
      WORLD.origin.y,
      WORLD.width,
      WORLD.height,
      TILE_SIZE / 2,
      TILE_SIZE / 2,
      undefined,
      undefined,
      0xffffff,
      0.4
    )
  }

  createRulers = () => {
    this.rulerH = new Ruler({
      scene: this,
      width: WORLD.width,
      height: WORLD.innerPadding,
      rulerScale: TILE_SIZE / 2,
      unitsNum: NUM_TILES_WIDTH * 2,
      fontSize: 12,
      strokeColor: 0xffffff,
      strokeAlpha: 0.8,
    })

    // this.rulerH.setPosition(0, 0)
    this.add.existing(this.rulerH)

    this.rulerV = new Ruler({
      scene: this,
      width: WORLD.innerPadding,
      height: WORLD.height,
      rulerScale: TILE_SIZE / 2,
      unitsNum: NUM_TILES_HEIGHT * 2,
      fontSize: 12,
      useLetters: true,
      strokeColor: 0xffffff,
      strokeAlpha: 0.8,
    })

    // this.rulerV.setPosition(0, 0)
    this.add.existing(this.rulerV)

    this.originButton = new OriginButton(
      this,
      WORLD.origin.x,
      WORLD.origin.y,
      WORLD.innerPadding,
      WORLD.innerPadding,
      COLOR_HINT_PRIMARY
    )
  }
}
