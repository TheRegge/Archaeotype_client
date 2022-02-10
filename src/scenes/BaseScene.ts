import Phaser, { Scene } from 'phaser'
import config from '../common/Config'

export default class BaseScene extends Phaser.Scene {
  public fadeColor: number
  public transitionTime: number
  public red: number
  public green: number
  public blue: number

  constructor(sceneInit: string | Phaser.Types.Scenes.SettingsConfig) {
    let keyString: string | undefined
    if (typeof sceneInit === 'object' && sceneInit.hasOwnProperty('key')) {
      keyString = sceneInit.key
    } else if (typeof sceneInit === 'string') {
      keyString = sceneInit
    } else {
      throw new Error(
        'Error: Wrong constructor parameter. The BaseScene constructor requires either a string or an object of type Phaser.Types.Scenes.SettingsConfig'
      )
    }

    super({ key: keyString })

    this.fadeColor = config.COLOR_GRAY_800
    const { r, g, b } = Phaser.Display.Color.ColorToRGBA(this.fadeColor)
    this.red = r
    this.green = g
    this.blue = b

    this.transitionTime = config.SCENE_TRANSITION_TIME
  }

  init() {
    this.setup()
    this.events.on('wake', () => {
      this.setup()
      this.transitionIn()
    })

    this.events.on('sleep', () => {
      this.cleanup()
    })
  }

  setup() {}

  cleanup() {}

  transitionIn() {
    this.cameras.main.fadeFrom(
      this.transitionTime,
      this.red,
      this.green,
      this.blue,
      false
    )
  }

  transitionOut(callback?: any) {
    if (!callback) callback = () => null

    this.cameras.main.fade(
      this.transitionTime * 0.5,
      this.red,
      this.green,
      this.blue,
      false,
      callback
    )
  }

  switchScene(key: string | Scene) {
    this.transitionOut(
      (camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        if (progress === 1) {
          this.scene.switch(key)
        }
      }
    )
  }

  getTileCoordsFromWorldCoords(
    x: number,
    y: number,
    horizontalIsLetters: boolean = false,
    verticalIsLetters: boolean = false
  ): { row: number | string; column: number | string } {
    let row: number | string = Math.ceil(y / config.TILE_SCALE)

    if (verticalIsLetters) {
      row = config.LETTERS[row - 1]
    }

    let column: number | string = Math.ceil(x / config.TILE_SCALE)

    if (horizontalIsLetters) {
      column = config.LETTERS[column - 1]
    }

    return { row, column }
  }
}
