export default class Ruler extends Phaser.GameObjects.Container {
  public scene: Phaser.Scene
  public background: Phaser.GameObjects.Rectangle
  public fontSize: number

  public constructor(scene: Phaser.Scene, width: number, height: number, scale: number, verticalUnitsNum: number, horizontalUnitsNum: number) {

    super(scene, width / 2, height / 2)

    this.fontSize = 13

    this.scene = scene
    this.scene.add.existing(this)
    scene.input.keyboard.on('keydown-R', this.toggle)

    this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, width, height, 0x000000, 0.2)
    this.add(this.background)

    // Horizontal Ruler
    if (width > height) {
      this.setScrollFactor(1, 0)

      for (let i = 1; i <= horizontalUnitsNum; i++) {
        const coords = {
          x: (i * scale) - (width / 2),
          y: 0,
          x1: 0,
          y1: height * -1 / 2,
          x2: 0,
          y2: height / 5
        }
        const tick = new Phaser.GameObjects.Line(this.scene, coords.x, coords.y, coords.x1, coords.y1, coords.x2, coords.y2)
        tick.setStrokeStyle(1, 0x000000, 0.5)
        this.add(tick)
        const tickText = new Phaser.GameObjects.Text(this.scene, coords.x, -3, i + '', { fontFamily: 'Varela Round', fontSize: `${this.fontSize}px`, color: '#333333' })
        if (i === horizontalUnitsNum) {
          tickText.setX(tickText.x - tickText.width - 2)
        } else {
          tickText.setX(tickText.x - tickText.width / 2)
        }
        this.add(tickText)
      }
    }

    // Vertical Ruler
    if (height > width) {
      this.setScrollFactor(0, 1)

      for (let i = 1; i <= verticalUnitsNum; i++) {
        const coords = {
          x: 0,
          y: (i * scale) - (height / 2),
          x1: width * -1 / 2,
          y1: 0,
          x2: width / 5,
          y2: 0
        }

        const tick = new Phaser.GameObjects.Line(this.scene, coords.x, coords.y, coords.x1, coords.y1, coords.x2, coords.y2)
        tick.setStrokeStyle(1, 0x000000, 0.5)
        this.add(tick)

        const tickText = new Phaser.GameObjects.Text(this.scene, -3, coords.y, i + '', { fontFamily: 'Varela Round', fontSize: `${this.fontSize}px`, color: '#333333', })
        if (i === verticalUnitsNum) {
          tickText.setY(tickText.y - tickText.height - 2)
        } else {
          tickText.setY(tickText.y - tickText.height / 2)
        }
        this.add(tickText)
      }
    }
  }

  toggle = () => {
    this.visible = !this.visible
  }
}