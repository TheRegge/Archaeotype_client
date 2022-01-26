import Phaser from 'phaser'
import Player from '../classes/Player'
import Minimap from '../classes/Minimap'
import ATGrid from '../classes/ATGrid'
import Ruler from '../classes/Ruler'
import OriginButton from '../classes/OriginButton'
import MainNav from '../classes/MainNav'
import config from '../common/Config'
import { Popup } from '../classes/Popup'
import Artifact from '../classes/Artifact'
import Measurer from '../classes/Measurer'

export default class QuadScene extends Phaser.Scene {
  private cursors
  private grid
  private popup
  private ignoredByMainCam: Phaser.GameObjects.GameObject[]
  private ignoredByMinimap: Phaser.GameObjects.GameObject[]
  private mainNav
  private minimap
  private minimapFrame
  private originButton
  private rulerH
  private rulerV
  private tileMap
  private topLayer
  private topLayerTiles
  public player

  constructor() {
    super({ key: 'quad' })
    this.ignoredByMainCam = []
    this.ignoredByMinimap = []
  }

  // preload() {
  // Assets for this scene are preloaded
  // in the previous scene (PreloadScene)
  // }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys()

    this.physics.world.setBounds(
      config.WORLD.origin.x,
      config.WORLD.origin.y,
      config.WORLD.width,
      config.WORLD.height
    )

    this.cameras.main.roundPixels = true
    this.cameras.main.setName('MAIN')

    // Add bg image
    // TODO: image y pos should be set at config.WORLD.origin.y (not * 2), but this is a hack to fix a bug I don't understand yet
    this.add
      .image(config.WORLD.origin.x * 2, config.WORLD.origin.y * 2, 'terrain')
      .setOrigin(0)

    // Place Artifacts on Map
    const artifactsJson = this.cache.json.get('artifacts')
    this.placeArtifacts(artifactsJson.artifacts)

    // Create tileMap
    this.tileMap = this.createTileMap()
    this.topLayerTiles = this.tileMap.addTilesetImage('toplayer-tiles')
    this.topLayer = this.tileMap.createLayer(
      0,
      this.topLayerTiles,
      config.WORLD.origin.x + config.H_OFFSET,
      config.WORLD.origin.y + config.V_OFFSET
    )
    // handle clicking on map
    this.input.on('pointerdown', this.handlePointerdown)
    // Player
    this.player = Player.getInstance(
      this,
      config.VIEWPORT.width,
      config.VIEWPORT.height
    )
    this.player.moveTo(config.WORLD.origin.x, config.WORLD.origin.y)
    this.ignoredByMainCam.push(this.player)

    this.createGrid()
    this.ignoredByMinimap.push(this.grid)

    this.createMinimap()
    this.ignoredByMainCam.push(this.minimap)
    this.ignoredByMainCam.push(this.minimapFrame)

    const measurer = new Measurer({
      scene: this,
    })
    this.add.existing(measurer)

    this.createRulers()
    this.ignoredByMinimap.push(this.rulerH)
    this.ignoredByMinimap.push(this.rulerV)
    this.ignoredByMinimap.push(this.originButton)

    this.createMainNav()
    this.ignoredByMinimap.push(this.mainNav)

    this.createPopup()
    this.ignoredByMinimap.push(this.popup)

    this.ignoredByMainCam.push(this.minimapFrame)

    this.cameras.main.ignore(this.ignoredByMainCam)
    this.minimap.ignore(this.ignoredByMinimap)
    this.cameras.main.startFollow(this.player, false, 0.05, 0.05)
    this.scene.launch('mainNav')
  }

  update() {
    this.player.body.setVelocity(0)
    this.moveWithKeys()
  }

  moveWithKeys = () => {
    let speed = config.PLAYER_SPEED

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
      config.WORLD.origin.x +
        config.VIEWPORT.width -
        config.WORLD.innerPadding -
        config.WORLD.origin.x -
        config.MINIMAP.width,
      config.WORLD.origin.y + config.WORLD.innerPadding + config.WORLD.origin.y,
      config.MINIMAP.width,
      config.MINIMAP.height,
      this
    )
    this.minimap.setName('MINIMAP')
    this.cameras.addExisting(this.minimap)
    const strokeWidth = 60
    this.minimapFrame = new Phaser.GameObjects.Rectangle(
      this,
      config.WORLD.origin.x + strokeWidth / 2,
      config.WORLD.origin.y + strokeWidth / 2,
      config.WORLD.width - strokeWidth,
      config.WORLD.height - strokeWidth
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
      config.WORLD.width,
      config.WORLD.height,
      config.TILE_SIZE,
      config.TILE_SIZE,
      undefined,
      undefined,
      0xffffff,
      0.4
    )
    this.grid.setOrigin(0)
    this.grid.setPosition(config.WORLD.origin.x, config.WORLD.origin.y * 2)
    this.add.existing(this.grid)
  }

  createRulers = () => {
    this.rulerH = new Ruler({
      scene: this,
      width: config.WORLD.width - config.WORLD.origin.x,
      height: config.WORLD.innerPadding,
      rulerScale: config.TILE_SIZE,
      unitsNum: config.NUM_TILES_WIDTH,
      fontSize: 15,
      tickColor: config.COLOR_HINT_PRIMARY,
      tickAlpha: 1,
    })
    this.rulerH.setPosition(config.WORLD.origin.x * 2, config.WORLD.origin.y)
    this.add.existing(this.rulerH)

    this.rulerV = new Ruler({
      scene: this,
      width: config.WORLD.innerPadding,
      height: config.WORLD.height - config.WORLD.origin.y,
      rulerScale: config.TILE_SIZE,
      unitsNum: config.NUM_TILES_HEIGHT,
      fontSize: 15,
      useLetters: true,
      tickColor: config.COLOR_HINT_PRIMARY,
      tickAlpha: 1,
    })
    this.rulerV.setPosition(config.WORLD.origin.x, config.WORLD.origin.y + 16)
    this.add.existing(this.rulerV)

    this.originButton = new OriginButton({
      scene: this,
      x: config.WORLD.origin.x,
      y: config.WORLD.origin.y,
      height: config.WORLD.innerPadding,
      width: config.WORLD.innerPadding,
      backgroundColor: config.COLOR_HINT_PRIMARY,
      backgroundHoverColor: config.COLOR_HINT_SECONDARY,
      clickHandler: () => {
        this.player.moveTo(config.WORLD.origin.x, config.WORLD.origin.y)
        return true
      },
    })
    this.add.existing(this.originButton)
  }

  createPopup = () => {
    const width = config.VIEWPORT.width / 2
    const height = config.VIEWPORT.height * 0.75
    this.popup = new Popup({
      scene: this,
      x: width / 2,
      y: (config.VIEWPORT.height - height) / 2 + config.WORLD.innerPadding,
      height,
      width,
      backgroundColor: config.COLOR_GRAY_900,
      backgroundOpacity: 0.9,
      clickHandler: () => this.popup.toggle(),
    })
    this.add.existing(this.popup)
  }

  createMainNav = () => {
    const navOptions = {
      scene: this,
      x: 0,
      y: 0,
      height: Math.floor(config.WORLD.origin.y),
      width: config.VIEWPORT.width,
      backgroundColor: config.COLOR_GRAY_700,
    }

    const baseLinkOptions = {
      linkColor: config.COLOR_HINT_PRIMARY,
      linkHoverColor: 0xffffff,
      backgroundColor: config.COLOR_GRAY_700,
      backgroundHoverColor: config.COLOR_HINT_PRIMARY,
    }

    const navLinks = [
      { name: 'Archaeotype', textColor: config.COLOR_HINT_SECONDARY },
      { name: 'Quad 1' },
      {
        name: 'Switch Quad',
        ...baseLinkOptions,
        callback: () => {
          this.scene.switch('site')
        },
      },
      {
        name: 'Collections',
        ...baseLinkOptions,
        callback: () => console.log('collection callback'),
      },
      {
        name: 'Library',
        ...baseLinkOptions,
        callback: () => {
          this.popup.showWithContent({
            title: 'Library',
            body: [
              'WELCOME TO THE LIBRARY',
              '----------------------',
              'Hello, this is the content for the library.',
              'I need to abstract the popup more.',
            ],
          })
        },
      },
      {
        name: 'Help',
        ...baseLinkOptions,
        callback: () => {
          this.popup.showWithContent({
            title: 'Archaeotype Help',
            body: [
              'MOVING AROUND:',
              '⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻',
              '- Use your keyboard arrow keys ⬅️ ➡️ ⬆️ ⬇️ to move around the quad, or drag the rectangle in the minimap.',
              '- Hold down the "Shift" key, to move 4x faster!',
              '- Click the white arrow with a blue background at the top left of the screen to reposition at the top left of the quad.',
              '',
              'KEYBOARD SHORTCUTS:',
              '⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻⎻',
              '- G: Show/hide the grid.',
              '- M: Show/hide the minimap.',
              '- R: Show/hide the rulers.',
              '- Z: Show/hide the measuring tape.',
            ],
          })
        },
      },
    ]

    this.mainNav = new MainNav(navOptions, navLinks)
  }

  createTileMap = (): Phaser.Tilemaps.Tilemap => {
    return this.make.tilemap({
      data: this.makeTopLayerData(),
      tileWidth: config.TILE_SIZE,
      tileHeight: config.TILE_SIZE,
    })
  }

  makeTopLayerData = () => {
    // TODO: try loading json from db, if it is empty,
    // then generate the tiles with zeros only
    const jsonData = this.cache.json.get('fakeTiles')

    return jsonData.data
    let dataMap: number[][] = []
    let numRows = config.NUM_TILES_WIDTH

    while (numRows > 0) {
      let row: number[] = []
      let numCols = config.NUM_TILES_HEIGHT
      while (numCols > 0) {
        row.push(0)
        numCols--
      }
      dataMap.push(row)
      numRows--
    }

    return dataMap
  }

  placeArtifacts = (artifactsData) => {
    artifactsData.forEach((data) => {
      const artifact = new Artifact(this, data)
      this.add.existing(artifact)
    })
  }

  /**
   * handler method for the 'pointerdown' event of the current scene.
   *
   * @memberof QuadScene
   */
  handlePointerdown = (e, gameObjects: Phaser.GameObjects.GameObject[]) => {
    if (this.clickDoesNotRemoveTileGuard(e, gameObjects)) return

    const tile = this.tileMap.removeTileAtWorldXY(
      e.worldX,
      e.worldY,
      false,
      false,
      this.cameras.main,
      this.topLayer
    ) as Phaser.Tilemaps.Tile
    if (tile) tile.destroy()
  }

  /**
   * Guard method: Checks if the callback of a click event should NOT remove a tile from the top layer
   *
   * A 'guard' method will interrupt the flow of a function when returning true
   *
   * @memberof QuadScene
   */
  clickDoesNotRemoveTileGuard = (
    e: any,
    gameObjects: Phaser.GameObjects.GameObject[]
  ): boolean => {
    return (
      (gameObjects.length > 0 &&
        gameObjects[0] instanceof Artifact === false) ||
      e.camera.name !== 'MAIN'
    )
  }
}
