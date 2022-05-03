import Phaser from 'phaser'
import BaseScene from './BaseScene'
import LabSubScene from './subScenes/LabSubScene'
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
import Data from '../common/Data'
import { ArtifactData } from '../common/Types'
import HelpSubScene from './subScenes/HelpSubScene'
import CollectionsSubScene from './subScenes/CollectionsSubscene'
import { AdminTools } from '../classes'
import Auth from '../common/Auth'
import { User } from '../common/Types'
import utils from '../common/Utils'
import ArtifactsChooser from '../classes/ArtifactsChooser'
import { IGetBounds } from '../common/Interfaces'

export default class QuadScene extends BaseScene {
  public artifactsChooser: ArtifactsChooser | null
  private adminTools: AdminTools | null
  private cursors
  private editMapLink: any
  private grid
  private popup
  private ignoredByMainCam: Phaser.GameObjects.GameObject[]
  private ignoredByMinimap: Phaser.GameObjects.GameObject[]
  private layer0_bgImage
  private layer1_artifacts
  private layer2_toptiles
  private layer3_UI_1
  private layer4_UI_2
  private mainNav
  private minimap
  private minimapFrame
  private originButton
  private rulerH
  private rulerV
  private tileMap
  private topLayer
  private topLayerTiles
  private sceneReady: boolean
  private isEditing: boolean = false
  private user: User | null
  public player

  constructor() {
    super({ key: 'quad' })
    this.ignoredByMainCam = []
    this.ignoredByMinimap = []
    this.sceneReady = false
    this.user = Auth.user
    this.editMapLink = 'foo'
    this.adminTools = null
    this.artifactsChooser = null
  }

  // preload() {
  // Assets for this scene are preloaded
  // in the previous scene (PreloadScene)
  // }

  init() {
    super.init()
  }

  setup() {
    this.scene.scene.input.on('dragstart', (_, gameObject) => {
      if (gameObject.name === 'ArtifactInChooser') {
        gameObject.setData('dragStart', {
          x: gameObject.x,
          y: gameObject.y,
        })

        gameObject.showDraggingState()
      }
    })

    this.scene.scene.input.on('dragend', (pointer, gameObject) => {
      if (typeof gameObject.clearTint === 'function') gameObject.clearTint()

      if (gameObject.name === 'ArtifactInChooser') {
        this.addArtifactToMap(gameObject, pointer)

        gameObject.setPosition(
          gameObject.getData('dragStart').x,
          gameObject.getData('dragStart').y
        )
        gameObject.showStillState()
      }

      if (gameObject.name === 'Artifact') {
        // TODO: implement update method
        // this.updateArtifactOnMap(gameObject, pointer)
      }
    })

    this.user = Auth.user

    if (this.user && this.user.role_id > 1) {
      this.data.set('quad', this.user.quad)
    }

    if (this.mainNav) this.createMainNav()

    if (this.tileMap) {
      const toplayer = this.topLayer as Phaser.Tilemaps.TilemapLayer
      toplayer.destroy()
      this.createTileMap().then((tilemap) => {
        this.populateTileMap(tilemap)

        // Place artifacts on the map
        this.getArtifacts().then((artifacts) => {
          this.placeArtifactsOnQuad(artifacts)
        })
      })
    }
  }

  cleanup() {
    this.player.reset()

    // remove artifacts
    this.destroyArtifacts()
  }

  create() {
    this.layer0_bgImage = this.add.layer()
    this.layer1_artifacts = this.add.layer()
    this.layer2_toptiles = this.add.layer()
    this.layer3_UI_1 = this.add.layer()
    this.layer4_UI_2 = this.add.layer()
    this.ignoredByMinimap.push(this.layer4_UI_2)

    // Fade in
    this.transitionIn()

    this.cursors = this.input.keyboard.createCursorKeys()

    this.physics.world.setBounds(
      config.WORLD.origin.x,
      config.WORLD.origin.y,
      config.WORLD.width,
      config.WORLD.height
    )

    this.cameras.main.roundPixels = true
    this.cameras.main.setName('MAIN')

    // Create tileMap
    this.createTileMap().then((tilemap) => {
      this.populateTileMap(tilemap)
      // Place artifacts on the map
      this.getArtifacts().then((artifacts) => {
        this.placeArtifactsOnQuad(artifacts)
      })

      // Add bg image
      // TODO: image y pos should be set at config.WORLD.origin.y (not * 2), but this is a hack to fix a bug I don't understand yet
      const bgImage = this.add
        .image(config.WORLD.origin.x * 2, config.WORLD.origin.y * 2, 'terrain')
        .setOrigin(0)

      this.layer0_bgImage.add([bgImage])

      // Player
      this.player = Player.getInstance(
        this,
        config.VIEWPORT.width,
        config.VIEWPORT.height
      )
      this.player.reset()
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

      this.createArtifactsChooser()
      if (this.artifactsChooser)
        this.ignoredByMinimap.push(this.artifactsChooser)
      this.createAdminTools()

      this.ignoredByMinimap.push(
        this.adminTools as Phaser.GameObjects.GameObject
      )

      this.createPopup()
      this.ignoredByMinimap.push(this.popup)

      this.ignoredByMainCam.push(this.minimapFrame)

      this.cameras.main.ignore(this.ignoredByMainCam)
      this.minimap.ignore(this.ignoredByMinimap)
      this.cameras.main.startFollow(this.player, false, 0.05, 0.05)
      this.sceneReady = true
    })
    // handle clicking on map
    this.input.on('pointerdown', this.handlePointerdown)
  }

  update() {
    if (!this.sceneReady) return

    this.player.body.setVelocity(0)
    this.moveWithKeys()
  }

  /**
   * Checks if pointer is above a specified game object
   *
   * @memberof QuadScene
   */
  checkPointerOverUI = (
    pointer: Phaser.Input.Pointer,
    ui: any
  ): ui is IGetBounds => {
    const pointerRectangle = new Phaser.Geom.Rectangle(
      pointer.x,
      pointer.y,
      1,
      1
    )
    return Phaser.Geom.Rectangle.Overlaps(pointerRectangle, ui.getBounds())
  }

  addArtifactToMap = async (gameObject, pointer) => {
    if (this.checkPointerOverUI(pointer, this.artifactsChooser)) return
    const dropLocation = {
      x: pointer.worldX,
      y: pointer.worldY - 50,
    }
    const artifactData = gameObject.getData('artifact')

    const dbData = await Data.getUnplacedArtifact(artifactData.id)
    const enrichedData = {
      ...artifactData,
      ...dbData,
    }

    // altSrc[]
    // -- coordinatesInMeters{x,y}
    // -- angle
    // -- fileName
    // -- imageSizeInPixels{width, height}
    // TODO: isPainting
    // -- mapId (quadId)
    // -- materials[]
    // -- src (`images/artifacts/onmap/${fileName}`)
    // -- weightInGrams ==> weight
    // ----> not needed: widthInCentimeters

    enrichedData.fileName = enrichedData.name
    enrichedData.coordinatesInMeters = this.getCoordinatesInMeters(dropLocation)
    enrichedData.angle = 0
    enrichedData.isPainting = false
    enrichedData.quadId = this.data.get('quad').id
    enrichedData.src = `${config.API_URL}resource/artifacts/onmap/${enrichedData.fileName}.png`
    enrichedData.imageSizeInPixels = {
      width: dbData.width_onmap,
      height: dbData.height_onmap,
    }

    delete enrichedData.updated_at
    delete enrichedData.originX
    delete enrichedData.originY
    delete enrichedData.height
    delete enrichedData.width

    const isSaved = await this.saveNewOnmapArtifact(
      enrichedData.id * 1,
      enrichedData.quadId,
      enrichedData.coordinatesInMeters.x,
      enrichedData.coordinatesInMeters.y,
      enrichedData.angle
    )

    if (isSaved) {
      this.placeArtifactsOnQuad([enrichedData])
    }
  }

  getCoordinatesInMeters = (location: {
    x: number
    y: number
  }): { x: number; y: number } => {
    const { origin } = config.WORLD
    const tileWidth = config.TILE_SIZE
    const tileHeight = config.TILE_SIZE

    const xInMeters = ((location.x - origin.x) / tileWidth) * config.TILE_SCALE
    const yInMeters = ((location.y - origin.y) / tileHeight) * config.TILE_SCALE

    return {
      x: xInMeters,
      y: yInMeters,
    }
  }

  createAdminTools() {
    if (this.adminTools) return
    this.adminTools = new AdminTools({
      scene: this,
      x: utils.metersToPixels(1) + config.WORLD.origin.x - 30,
      y: utils.metersToPixels(2) + config.WORLD.origin.y,
      height: 250,
      width: 60,
      backgroundColor: config.COLOR_GRAY_900,
      backgroundOpacity: 0.8,
      backgroundOverColor: config.COLOR_GRAY_900,
      // backgroundOverOpacity: 0.9,
    })
    this.adminTools.toggle()
    this.add.existing(this.adminTools)
    this.adminTools.setInteractive()
    this.input.setDraggable(this.adminTools)
  }

  createArtifactsChooser() {
    this.artifactsChooser = new ArtifactsChooser({
      scene: this,
      x: 200,
      y: 200,
      width: 500,
      height: 410,
      backgroundColor: config.COLOR_GRAY_900,
      backgroundOpacity: 0.8,
    })
    this.artifactsChooser.toggle()

    this.add.existing(this.artifactsChooser)
  }

  destroyArtifacts = () => {
    const layer1_artifacts = this.layer1_artifacts as Phaser.GameObjects.Layer
    const artifacts = layer1_artifacts.getChildren()
    artifacts.forEach((artifact) => {
      artifact.destroy()
    })
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
    // this.add.existing(this.minimapFrame)
    this.layer3_UI_1.add([this.minimapFrame])
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
    // this.add.existing(this.grid)
    this.layer3_UI_1.add(this.grid)
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
    // this.add.existing(this.rulerH)

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
    // this.add.existing(this.rulerV)

    this.originButton = new OriginButton({
      scene: this,
      x: config.WORLD.origin.x,
      y: config.WORLD.origin.y,
      height: config.WORLD.innerPadding,
      width: config.WORLD.innerPadding,
      backgroundColor: config.COLOR_HINT_PRIMARY_STRONG,
      backgroundOverColor: config.COLOR_HINT_SECONDARY_STRONG,
      clickHandler: () => {
        this.player.moveTo(config.WORLD.origin.x, config.WORLD.origin.y)
        return true
      },
    })
    // this.add.existing(this.originButton)
    this.layer3_UI_1.add([this.rulerH, this.rulerV, this.originButton])
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
    // this.add.existing(this.popup)
    this.layer4_UI_2.add([this.popup])
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
      backgroundOverColor: config.COLOR_HINT_PRIMARY,
    }

    const navLinks = [
      { name: 'Archaeotype', textColor: config.COLOR_HINT_SECONDARY },
      { name: this.data.get('quad').name },
      {
        name: 'Switch Quad',
        ...baseLinkOptions,
        maxRoleId: 1,
        saveRef: 'foo',
        callback: () => {
          this.switchScene('site')
        },
      },
      {
        name: 'Collections',
        ...baseLinkOptions,
        callback: () => {
          const toScene = this.scene.get('collections')
          const data = {
            fromScene: this,
            htmlTagName: 'collections',
            htmlData: {},
          }

          if (toScene) {
            this.scene.wake('collections', data)
          } else {
            this.scene.add('collections', CollectionsSubScene, true, data)
          }
          this.scene.pause(this.scene.key)
        },
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
          const toScene = this.scene.get('help')
          const data = {
            fromScene: this,
            htmlTagName: 'help',
            htmlData: {},
          }

          if (toScene) {
            this.scene.wake('help', data)
          } else {
            this.scene.add('help', HelpSubScene, true, data)
          }
          this.scene.pause(this.scene.key)
        },
      },
    ]

    if (Auth.isAdmin()) {
      navLinks.push({
        name: 'Edit Map',
        ...baseLinkOptions,
        saveRef: 'editMapLink',
        callback: () => {
          this.isEditing = !this.isEditing

          if (this.isEditing) {
            this.openEditing()
          } else {
            this.closeEditing()
          }
        },
      })
    }

    this.mainNav = new MainNav(navOptions, navLinks)
    this.layer4_UI_2.add([this.mainNav])
  }

  openEditing = () => {
    this.editMapLink.text.setText('Close Editing')
    this.topLayer.setVisible(false)
    this.adminTools?.toggle()
  }

  closeEditing = () => {
    this.editMapLink.text.setText('Edit Map')
    this.topLayer.setVisible(true)
    this.adminTools?.toggle()
    this.artifactsChooser?.setVisible(false)
  }

  createTileMap = async (): Promise<Phaser.Tilemaps.Tilemap> => {
    const topLayerData = await this.makeTopLayerData()
    const tilemap = this.make.tilemap({
      data: topLayerData,
      tileWidth: config.TILE_SIZE,
      tileHeight: config.TILE_SIZE,
      insertNull: true, // Do not create a tile when the data is -1
    })
    return tilemap
  }

  populateTileMap(tilemap: Phaser.Tilemaps.Tilemap): void {
    this.tileMap = tilemap as Phaser.Tilemaps.Tilemap
    this.topLayerTiles = this.tileMap.addTilesetImage('toplayer-tiles')
    this.topLayer = this.tileMap.createLayer(
      0,
      this.topLayerTiles,
      config.WORLD.origin.x + config.H_OFFSET,
      config.WORLD.origin.y + config.V_OFFSET
    )
    this.layer2_toptiles.add([this.topLayer])
  }

  makeTopLayerData = async () => {
    let tilesData = await Data.getTiles(this.data.get('quad').id).catch(() => {
      return this.fillAllTiles()
    })

    return tilesData.map((arr) => {
      return arr.map((tile) => {
        if (tile === 0) {
          return Math.round(Math.random() * 63)
        }
        return tile
      })
    })
  }

  /**
   * Used when the tiles data is not available.
   *
   * @protected
   * @returns {number[][]}
   * @memberof QuadScene
   */
  protected fillAllTiles(): number[][] {
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

  getArtifacts = async () => {
    let artifacts = await Data.getArtifactsOnQuad(
      parseInt(this.data.get('quad').id)
    )
    return artifacts
  }

  placeArtifactsOnQuad = (artifactsData) => {
    artifactsData.forEach((data) => {
      const artifact = new Artifact(this, data)
      artifact.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, data.width_onmap, data.height_onmap),
        Phaser.Geom.Rectangle.Contains
      )
      // this.input.enableDebug(artifact)
      this.layer1_artifacts.add([artifact])
    })
  }

  saveNewOnmapArtifact = async (
    artifact_id: number,
    quad_id: number,
    x: number,
    y: number,
    angle: number
  ): Promise<Boolean> => {
    return Data.saveNewOnmapArtifact(artifact_id, quad_id, x, y, angle)
  }

  /**
   * Callback function called when clicking on an Artifact.
   *
   * The function is called from the artifact.
   *
   * **Note:** We use `scene.pause/resume` for the quad scene because
   * it pauses all the scene's systems but leaves it visible. We
   * use `scene.sleep/wake` for the LabSubscene because it needs to
   * be hidden when not active.
   *
   * @memberof QuadScene
   */
  clickArtifactCallback = (
    data: ArtifactData,
    artifact: Phaser.GameObjects.Sprite
  ) => {
    if (!this.isEditing) {
      this.openLab(data)
    } else {
      this.setupEditing(artifact)
    }
  }

  setupEditing = (artifact: Phaser.GameObjects.Sprite) => {
    this.scene.scene.input.setDraggable(artifact)
    artifact.setTint(0xff0000)
  }

  openLab = (artifact: ArtifactData) => {
    const toScene = this.scene.get('lab')
    const data = {
      fromScene: this,
      htmlTagName: 'labForm',
      htmlData: {
        artifact,
        tile: this.getTileCoordsFromWorldCoords(
          artifact.coordinatesInMeters.x,
          artifact.coordinatesInMeters.y,
          false,
          true
        ),
      },
    }

    if (toScene) {
      this.scene.wake('lab', data)
    } else {
      this.scene.add('lab', LabSubScene, true, data)
    }
    this.scene.pause('quad')
  }

  /**
   * handler method for the 'pointerdown' event of the current scene.
   *
   * @memberof QuadScene
   */
  handlePointerdown = async (
    pointer: Phaser.Input.Pointer,
    gameObjects: any
  ) => {
    if (this.clickDoesNotRemoveTileGuard(pointer, gameObjects)) return

    const artifactData = gameObjects[0]?.data.getAll() as ArtifactData

    const tile: Phaser.Tilemaps.Tile | null = this.tileMap.removeTileAtWorldXY(
      pointer.worldX,
      pointer.worldY,
      true,
      false,
      this.cameras.main,
      this.topLayer
    ) as Phaser.Tilemaps.Tile

    if (tile) {
      tile.destroy()
      Data.saveDestroyedTile(
        this.data.get('quad').id,
        tile.x,
        tile.y,
        Auth.user?.id || 99,
        () => {}
      )
    } else if (artifactData) {
      this.clickArtifactCallback(
        artifactData,
        gameObjects[0] as Phaser.GameObjects.Sprite
      )
    }
  }

  /**
   * Guard method: Checks if the callback of a click event should NOT remove a tile from the top layer
   *
   * A 'guard' method will interrupt the flow of a function when returning true
   *
   * @memberof QuadScene
   */
  clickDoesNotRemoveTileGuard = (
    pointer: Phaser.Input.Pointer,
    gameObjects: Phaser.GameObjects.GameObject[]
  ): boolean => {
    return (
      (gameObjects.length > 0 &&
        gameObjects[0] instanceof Artifact === false) ||
      (gameObjects.length === 0 && this.isEditing === true) ||
      pointer.camera.name !== 'MAIN'
    )
  }
}
