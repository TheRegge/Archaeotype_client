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
    HINT_COLOR
} from '../main'



export default class SiteScene extends Phaser.Scene {
    private minimap
    public player
    private cursors
    private grid
    private rulerH
    private rulerV
    private originButton

    constructor() {
        super('site')
    }

    preload() {
        this.load.setPath('assets/')
        this.load.image('cursor-hand', 'images/cursor-hand.png')

    }

    create() {
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
            TILE_SIZE,
            TILE_SIZE,
            undefined,
            undefined,
            0xFFFFFF,
            0.4)
    }

    createRulers = () => {
        this.rulerH = new Ruler(
            this,
            WORLD.width,
            WORLD.innerPadding,
            TILE_SIZE,
            NUM_TILES_HEIGHT,
            NUM_TILES_WIDTH
        )

        this.rulerV = new Ruler(
            this,
            WORLD.innerPadding,
            WORLD.height,
            TILE_SIZE,
            NUM_TILES_HEIGHT,
            NUM_TILES_WIDTH
        )

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
