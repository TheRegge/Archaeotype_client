import Phaser from 'phaser'
import Player from '../classes/Player'
import Minimap from '../classes/Minimap'
import ATGrid from '../classes/ATGrid'
import Ruler from '../classes/Ruler'
import OriginButton from '~/classes/OriginButton'

import {
    TILE_SIZE,
    NUM_TILES_HEIGHT,
    NUM_TILES_WIDTH,
    MINIMAP,
    PLAYER_SPEED,
    WORLD,
    VIEWPORT,
    HINT_COLOR,
    HINT_COLOR_HEX
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
        super('site')
    }

    preload() {
        this.load.setPath('/assets/')
        this.load.image('terrain', 'images/terrains/q1.jpg')

    }

    create() {
        this.add.image(0, 0, 'terrain').setPosition(WORLD.width / 2, WORLD.height / 2)
        const ignoredByMainCam: Phaser.GameObjects.GameObject[] = []
        const ignoredByMinimap: Phaser.GameObjects.GameObject[] = []
        this.cursors = this.input.keyboard.createCursorKeys()

        this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height)
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
        this.minimapFrame = new Phaser.GameObjects.Rectangle(this, strokeWidth / 2, strokeWidth / 2, WORLD.width - strokeWidth, WORLD.height - strokeWidth)
        this.minimapFrame.setStrokeStyle(strokeWidth, 0xFFFFFF, .5)
        this.minimapFrame.setOrigin(0, 0)
        this.add.existing(this.minimapFrame)
        ignoredByMainCam.push(this.minimapFrame)

        this.cameras.main.ignore(ignoredByMainCam)
        this.minimap.ignore(ignoredByMinimap)
        this.cameras.main.startFollow(this.player, false, 0.05, 0.05)
    }

    update() {
        this.player.body.setVelocity(0);
        let speed = PLAYER_SPEED

        if (this.cursors.shift.isDown) {
            speed *= 4
        }

        if (this.cursors.left.isDown) {
            this.player.moveLeft(speed)
        }
        else if (this.cursors.right.isDown) {
            this.player.moveRight(speed)
        }

        if (this.cursors.up.isDown) {
            this.player.moveUp(speed)
        }
        else if (this.cursors.down.isDown) {
            this.player.moveDown(speed)
        }
    }

    setupMainCam = () => {
        this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height).setName('main')
        this.cameras.main.setViewport(0, 0, VIEWPORT.width, VIEWPORT.height)
        this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height)
        this.cameras.main.scrollX = 0
        this.cameras.main.scrollY = 0
        this.cameras.main.setBackgroundColor(0xdddddd)
    }

    createMinimap = () => {
        return new Minimap(
            VIEWPORT.width - WORLD.innerPadding - MINIMAP.width,
            WORLD.innerPadding * 2,
            MINIMAP.width,
            MINIMAP.height,
            this
        )
    }

    createGrid = () => {
        return new ATGrid(
            this,
            0,
            0,
            WORLD.width,
            WORLD.height,
            TILE_SIZE / 2,
            TILE_SIZE / 2,
            undefined,
            undefined,
            0xFFFFFF,
            0.4)
    }

    createRulers = () => {
        this.rulerH = new Ruler({
            scene: this,
            width: WORLD.width,
            height: WORLD.innerPadding,
            rulerScale: TILE_SIZE / 2,
            unitsNum: NUM_TILES_HEIGHT * 2,
            fontSize: 12,
            strokeColor: 0XFFFFFF,
            strokeAlpha: 0.8
        })

        this.rulerV = new Ruler({
            scene: this,
            width: WORLD.innerPadding,
            height: WORLD.height,
            rulerScale: TILE_SIZE / 2,
            unitsNum: NUM_TILES_HEIGHT * 2,
            fontSize: 12,
            useLetters: true,
            strokeColor: 0XFFFFFF,
            strokeAlpha: 0.8
        })

        this.originButton = new OriginButton(
            this,
            0,
            0,
            WORLD.innerPadding,
            WORLD.innerPadding,
            HINT_COLOR
        )

    }
}
