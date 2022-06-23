import Phaser from 'phaser'

// Scenes
import BaseScene from './BaseScene'

// SubScenes
import CollectionItemSubScene from './subScenes/CollectionItemSubScene'
import CollectionsSubScene from './subScenes/CollectionsSubScene'
import HelpSubScene from './subScenes/HelpSubScene'
import LabSubScene from './subScenes/LabSubScene'

// Classes
import { Popup } from '../classes/Popup'
import Artifact from '../classes/Artifact'
import ArtifactsChooser from '../classes/ArtifactsChooser'
import ATGrid from '../classes/ATGrid'
import MainNav from '../classes/MainNav'
import Measurer from '../classes/Measurer'
import Minimap from '../classes/Minimap'
import OriginButton from '../classes/OriginButton'
import Player from '../classes/Player'
import Ruler from '../classes/Ruler'

//Common
import { AdminTools } from '../classes'
import { ArtifactData, User, QuadPointerState } from '../common/Types'
import { IGetBounds } from '../common/Interfaces'
import Auth from '../common/Auth'
import config from '../common/Config'
import Data from '../common/Data'
import utils from '../common/Utils'

export default class QuadScene extends BaseScene {
  public artifactsChooser: ArtifactsChooser | null
  private adminTools: AdminTools | null
  private bgImage: Phaser.GameObjects.Image | null = null
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
  private user: User | null
  public player
  public pointerState: QuadPointerState = 'play'
  public pointerStateCache: QuadPointerState = 'play'
  // Debug:
  public debug = false
  public debugPointerStateText
  public debugPointerStateTextCache

  constructor() {
    super({ key: 'quad' })
    this.ignoredByMainCam = []
    this.ignoredByMinimap = []
    this.sceneReady = false
    this.user = Auth.user
    this.editMapLink = 'foo'
    this.adminTools = null
    this.artifactsChooser = null
    this.setPointerState('play')
  }

  // preload() {
  // Assets for this scene are preloaded
  // in the previous scene (PreloadScene)
  // }

  init() {
    super.init()
    this.setPointerState('play')
  }

  async setup() {
    this.user = Auth.user

    if (!this.user) {
      this.scene.start('login')
      return
    }

    const bgImageName = this.data.get('quad').bgFilename.split('.')[0]
    this.bgImage?.setTexture(bgImageName)

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
      const bgImageName = this.data.get('quad').bgFilename.split('.')[0]
      this.bgImage = this.add
        .image(
          config.WORLD.origin.x * 2,
          config.WORLD.origin.y * 2,
          bgImageName
        )
        .setOrigin(0)

      this.layer0_bgImage.add([this.bgImage])

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
      switch (this.pointerState) {
        case 'edit':
          if (gameObject.name === 'Artifact') {
            this.updateArtifactOnMap(gameObject, pointer)
            if (typeof gameObject.clearTint === 'function')
              gameObject.clearTint()

            this.scene.scene.input.setDraggable(gameObject, false)
          }
          break

        case 'add':
          if (gameObject.name === 'ArtifactInChooser') {
            this.addArtifactToMap(gameObject, pointer)
            gameObject.setPosition(
              gameObject.getData('dragStart').x,
              gameObject.getData('dragStart').y
            )
            gameObject.showStillState()
          }
          break

        default:
          break
      }
    })

    if (this.debug) {
      this.debugPointerStateText = this.add
        .text(200, 200, 'pointerState: ' + this.pointerState)
        .setScrollFactor(0)

      this.debugPointerStateTextCache = this.add
        .text(200, 250, 'cache: ' + this.pointerState)
        .setScrollFactor(0)
    }
  }

  update() {
    if (!this.sceneReady) return

    if (this.debug) {
      this.debugPointerStateText.text = 'pointerState: ' + this.pointerState
      this.debugPointerStateTextCache.text = 'cache: ' + this.pointerStateCache
    }

    switch (this.pointerState) {
      case 'add':
        this.input.manager.setDefaultCursor('copy')
        break

      case 'delete':
        this.input.manager.setDefaultCursor('not-allowed')
        break

      case 'edit':
        this.input.manager.setDefaultCursor('move')
        break

      case 'rotate':
        this.input.manager.setDefaultCursor('grab')
        break

      default:
        this.input.manager.setDefaultCursor('default')
        break
    }

    this.player.body.setVelocity(0)
    this.listenToKeyInputs()
  }

  setPointerState(newState: QuadPointerState) {
    this.pointerStateCache = this.pointerState
    this.pointerState = newState
  }

  togglePointerState(newState: QuadPointerState) {
    if (this.pointerState === newState) {
      this.pointerState = this.pointerStateCache
    } else {
      this.pointerState = this.pointerStateCache = newState
    }
  }

  updateArtifactOnMap = async (
    artifact: Phaser.GameObjects.GameObject,
    pointer: any
  ) => {
    const newX =
      Math.floor(utils.pixelsToMeters(pointer.worldX - config.H_OFFSET) * 100) /
      100
    const newY =
      Math.floor(
        utils.pixelsToMeters(
          pointer.worldY - config.V_OFFSET - this.mainNav.height
        ) * 100
      ) / 100

    artifact.setData('coordinatesInMeters', {
      x: newX,
      y: newY,
    })

    const data = {
      onmap_id: artifact.data.get('onmap_id') * 1,
      x: newX,
      y: newY,
      angle: parseInt(artifact.getData('angle')),
    }

    const success = await Data.updateArtifactOnMap(data)

    success ? console.log('success') : console.log('failure')
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
    console.log('add artifact to map')
    if (this.checkPointerOverUI(pointer, this.artifactsChooser)) return
    const dropLocation = {
      x: pointer.worldX,
      y: pointer.worldY - this.mainNav.height,
    }
    const artifactData = gameObject.getData('artifact')

    const dbData = await Data.getUnplacedArtifact(artifactData.id)
    const enrichedData = {
      ...artifactData,
      ...dbData,
    }

    // TODO: isPainting

    enrichedData.fileName = enrichedData.name
    enrichedData.coordinatesInMeters = this.getCoordinatesInMeters(dropLocation)
    enrichedData.angle = 0
    enrichedData.isPainting = false
    enrichedData.quadId = this.data.get('quad').id
    enrichedData.src = `${process.env.API_URL}resource/artifacts/onmap/${enrichedData.fileName}.png`
    enrichedData.imageSizeInPixels = {
      width: dbData.width_onmap,
      height: dbData.height_onmap,
    }

    delete enrichedData.updated_at
    delete enrichedData.originX
    delete enrichedData.originY
    delete enrichedData.height
    delete enrichedData.width

    const insertID = await this.saveNewOnmapArtifact(
      enrichedData.id * 1,
      enrichedData.quadId,
      enrichedData.coordinatesInMeters.x,
      enrichedData.coordinatesInMeters.y,
      enrichedData.angle
    )

    enrichedData.onmap_id = insertID

    if (insertID > 0) {
      this.placeArtifactsOnQuad([enrichedData])
    } else {
      console.error('failed to insert artifact')
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
      backgroundOpacity: 1,
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

    layer1_artifacts.removeAll()
  }

  listenToKeyInputs = () => {
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

    if (this.cursors.space.isDown) {
      // NOT using setPointerState on purpose:
      // We DO NOT want to cache the 'reveal' state
      // Otherwise, we won't be able to leave it.
      this.pointerState = 'reveal'
    } else {
      this.pointerState = this.pointerStateCache
    }
  }

  setCursor = () => {
    // if (this.cursors.opt)
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
      0xdddddd,
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
            htmlData: {
              quad: this.data.get('quad'),
            },
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
          if (this.pointerState === 'play') {
            this.setPointerState('edit')
            this.openEditing()
          } else {
            this.setPointerState('play')
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
    this.setPointerState('edit')
  }

  closeEditing = () => {
    this.editMapLink.text.setText('Edit Map')
    this.topLayer.setVisible(true)
    this.adminTools?.toggle()
    this.artifactsChooser?.setVisible(false)
    this.setPointerState('play')
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

  placeArtifactsOnQuad = (artifactsData: ArtifactData[]) => {
    artifactsData.forEach((data) => {
      const artifact = new Artifact(this, data)
      artifact.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, data.width_onmap, data.height_onmap),
        Phaser.Geom.Rectangle.Contains
      )

      artifact.on('pointerover', () => {
        if (this.pointerState === 'reveal') {
          this.input.enableDebug(artifact)
        }
      })

      artifact.on('pointerout', () => {
        this.input.removeDebug(artifact)
      })
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
  ): Promise<number> => {
    return Data.saveNewOnmapArtifact(artifact_id, quad_id, x, y, angle)
  }

  openLab = (
    artifactData: ArtifactData,
    artifact: Phaser.GameObjects.GameObject
  ) => {
    const toScene = this.scene.get('lab')

    const data = {
      fromScene: this,
      htmlTagName: 'labForm',
      htmlData: {
        artifact,
        artifactData,
        tile: this.getTileCoordsFromWorldCoords(
          artifactData.coordinatesInMeters.x,
          artifactData.coordinatesInMeters.y,
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

  openCollectionItem = (artifactData: ArtifactData) => {
    const toScene = this.scene.get('collectionitem')

    const data = {
      fromScene: this,
      htmlTagName: 'collectionitem',
      htmlData: {
        artifactData,
      },
    }

    if (toScene) {
      this.scene.wake('collectionitem', data)
    } else {
      this.scene.add('collectionitem', CollectionItemSubScene, true, data)
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
    switch (this.pointerState) {
      case 'play':
      case 'reveal':
        this.handlePointerDownPlayState(pointer, gameObjects)
        break

      case 'edit':
        this.handlePointerDownEditState(pointer, gameObjects)
        break

      case 'delete':
        this.handlePointerDownDeleteState(pointer, gameObjects)
        break

      case 'add':
        this.handlePointerDownAddState(pointer, gameObjects)
        break

      default:
        console.error('Unknown pointer state')
        break
    }
  }

  handlePointerDownPlayState = (
    pointer: Phaser.Input.Pointer,
    gameObjects: any
  ) => {
    if (this.clickDoesNotRemoveTileGuard(pointer, gameObjects)) return

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
    } else if (
      gameObjects[0] &&
      gameObjects[0].name.toLowerCase() === 'artifact'
    ) {
      const artifactData = gameObjects[0]?.data.getAll() as ArtifactData
      if (gameObjects[0].data.get('flag') !== true) {
        this.openLab(artifactData, gameObjects[0])
      } else {
        this.openCollectionItem(artifactData)
      }
    }
  }

  handlePointerDownAddState = (
    pointer: Phaser.Input.Pointer,
    gameObjects: any
  ) => {
    console.log('handlePointerDownAddState')
  }

  handlePointerDownEditState = (
    pointer: Phaser.Input.Pointer,
    gameObjects: any
  ) => {
    if (this.clickDoesNotRemoveTileGuard(pointer, gameObjects)) return

    if (gameObjects[0] && gameObjects[0].name.toLowerCase() === 'artifact') {
      // this.setupEditing(gameObjects[0] as Phaser.GameObjects.Sprite)
      const artifact = gameObjects[0] as Phaser.GameObjects.Sprite
      this.scene.scene.input.setDraggable(artifact)
      artifact.setTint(0xff0000)
    }
  }

  handlePointerDownDeleteState = async (
    pointer: Phaser.Input.Pointer,
    gameObjects: any
  ) => {
    if (this.clickDoesNotRemoveTileGuard(pointer, gameObjects)) return

    if (gameObjects[0] && gameObjects[0].name.toLowerCase() === 'artifact') {
      this.setPointerState('edit')
      const artifact = gameObjects[0]
      if (
        window.confirm(`Do you want to delete ${artifact.data.get('name')}?`)
      ) {
        const onmap_id = artifact.data.get('onmap_id')

        const deleted = await Data.deleteOnmapArtifact(onmap_id)
        if (deleted) {
          gameObjects[0].destroy()
        } else {
          console.error('Could not delete artifact')
        }
      }
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
      (gameObjects.length === 0 && this.pointerState !== 'play') ||
      pointer.camera.name !== 'MAIN'
    )
  }
}
