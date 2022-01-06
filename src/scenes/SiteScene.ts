import Phaser from 'phaser'
import Player from '~/classes/Player'
import Minimap from '~/classes/Minimap'
import ATGrid from '~/classes/ATGrid'
import Ruler from '~/classes/Ruler'
import OriginButton from '~/classes/OriginButton'
import MainNav from '~/classes/MainNav'

import {
  TILE_SIZE,
  NUM_TILES_HEIGHT,
  NUM_TILES_WIDTH,
  MINIMAP,
  PLAYER_SPEED,
  WORLD,
  VIEWPORT,
  COLOR_HINT_PRIMARY,
  COLOR_HINT_SECONDARY,
  COLOR_GRAY_MEDIUM,
} from '../main'

export default class SiteScene extends Phaser.Scene {
  private cursors
  private grid
  private mainNav
  private minimap
  private minimapFrame
  private originButton
  private rulerH
  private rulerV
  public player

  constructor() {
    super({ key: 'site' })
  }

  preload() {
    // Assets for this scene are preloaded
    // in the previous scene (LoadingScene)
  }

  create() {
    const ignoredByMainCam: Phaser.GameObjects.GameObject[] = []
    const ignoredByMinimap: Phaser.GameObjects.GameObject[] = []
    this.cursors = this.input.keyboard.createCursorKeys()

    this.physics.world.setBounds(
      WORLD.origin.x,
      WORLD.origin.y,
      WORLD.width,
      WORLD.height
    )

    this.cameras.main.roundPixels = true

    // Add bg image
    // TODO: image y pos should be set at WORLD.origin.y (not * 2), but this is a hack to fix a bug I don't understand yet
    this.add
      .image(WORLD.origin.x * 2, WORLD.origin.y * 2, 'terrain')
      .setOrigin(0)
    // .setPosition(WORLD.origin.x, WORLD.origin.y)

    // Player
    this.player = Player.getInstance(this, VIEWPORT.width, VIEWPORT.height)
    this.player.moveTo(WORLD.origin.x, WORLD.origin.y)
    ignoredByMainCam.push(this.player)

    this.createGrid()
    ignoredByMinimap.push(this.grid)

    this.createMinimap()
    ignoredByMainCam.push(this.minimap)
    ignoredByMainCam.push(this.minimapFrame)

    this.createRulers()
    ignoredByMinimap.push(this.rulerH)
    ignoredByMinimap.push(this.rulerV)
    ignoredByMinimap.push(this.originButton)

    this.createMainNav()
    ignoredByMinimap.push(this.mainNav)

    ignoredByMainCam.push(this.minimapFrame)

    this.cameras.main.ignore(ignoredByMainCam)
    this.minimap.ignore(ignoredByMinimap)
    this.cameras.main.startFollow(this.player, false, 0.05, 0.05)
    this.scene.launch('mainNav')
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

  createMinimap = () => {
    this.minimap = new Minimap(
      WORLD.origin.x +
        VIEWPORT.width -
        WORLD.innerPadding -
        WORLD.origin.x -
        MINIMAP.width,
      WORLD.origin.y + WORLD.innerPadding + WORLD.origin.y,
      MINIMAP.width,
      MINIMAP.height,
      this
    )
    this.cameras.addExisting(this.minimap)
    const strokeWidth = 60
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
  }

  createGrid = () => {
    this.grid = new ATGrid(
      this,
      0,
      0,
      WORLD.width,
      WORLD.height,
      TILE_SIZE / 2,
      TILE_SIZE / 2,
      undefined,
      undefined,
      0xffffff,
      0.4
    )
    this.grid.setOrigin(0)
    this.grid.setPosition(WORLD.origin.x, WORLD.origin.y * 2)
    this.add.existing(this.grid)
  }

  createRulers = () => {
    this.rulerH = new Ruler({
      scene: this,
      width: WORLD.width - WORLD.origin.x,
      height: WORLD.innerPadding,
      rulerScale: TILE_SIZE / 2,
      unitsNum: NUM_TILES_WIDTH * 2,
      fontSize: 14,
      strokeColor: 0xffffff,
      strokeAlpha: 0.8,
    })
    this.rulerH.setPosition(WORLD.origin.x * 2, WORLD.origin.y)
    this.add.existing(this.rulerH)

    this.rulerV = new Ruler({
      scene: this,
      width: WORLD.innerPadding,
      height: WORLD.height - WORLD.origin.y,
      rulerScale: TILE_SIZE / 2,
      unitsNum: NUM_TILES_HEIGHT * 2,
      fontSize: 14,
      // useLetters: true,
      strokeColor: 0xffffff,
      strokeAlpha: 0.8,
    })
    this.rulerV.setPosition(WORLD.origin.x, WORLD.origin.y + 16)
    this.add.existing(this.rulerV)

    this.originButton = new OriginButton({
      scene: this,
      x: WORLD.origin.x,
      y: WORLD.origin.y,
      height: WORLD.innerPadding,
      width: WORLD.innerPadding,
      backgroundColor: COLOR_HINT_PRIMARY,
      backgroundHoverColor: COLOR_HINT_SECONDARY,
      clickHandler: () => {
        this.player.moveTo(WORLD.origin.x, WORLD.origin.y)
        return true
      },
    })
    this.add.existing(this.originButton)
  }

  createMainNav = () => {
    this.mainNav = new MainNav(
      {
        scene: this,
        x: 0,
        y: 0,
        height: Math.floor(WORLD.origin.y),
        width: VIEWPORT.width,
        backgroundColor: COLOR_GRAY_MEDIUM,
      },
      [
        { name: 'Archaeotype' },
        { name: 'Quad 1' },
        {
          name: 'Collections',
          linkColor: COLOR_HINT_PRIMARY,
          callback: () => console.log('collection callback'),
        },
        {
          name: 'Library',
          linkColor: COLOR_HINT_PRIMARY,
          callback: () => console.log('Library callback'),
        },
        {
          name: 'Help',
          linkColor: COLOR_HINT_PRIMARY,
          callback: () => console.log('Help callback'),
        },
      ]
    )

    this.add.existing(this.mainNav)
  }
}
