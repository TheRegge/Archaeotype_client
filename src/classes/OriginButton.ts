import SiteScene from "~/scenes/SiteScene"
import { IToggle } from "./IToggle"
export default class OriginButton extends Phaser.GameObjects.Container implements IToggle {
  public background: Phaser.GameObjects.Rectangle

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor: number = 0xFF0000,
    opacity: number = 1
  ) {
    super(scene, x, y)
    this.setPosition(width / 2, height / 2)

    this.background = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      width,
      height,
      backgroundColor,
      opacity
    )

    this.add(this.background)

    this.setScrollFactor(0, 0)
    this.setSize(width, height)

    this.setInteractive({
      hitArea: this.background.geom,
      cursor: 'pointer'
    })

    this.scene.input.keyboard.on('keydown-R', this.toggle)

    this.on('pointerdown', this.clickHandler)

    this.on('pointerup', () => {
      this.background.setFillStyle(0xCC0000)
    })

    this.on('pointerover', () => {
      this.background.setFillStyle(0xCC0000)
    })

    this.on('pointerout', () => {
      this.background.setFillStyle(backgroundColor)
    })

    this.scene.add.existing(this)
  }

  clickHandler = () => {
    this.background.setFillStyle(0xFF0000)
    const scene = this.scene as SiteScene
    scene.player.setPosition(0, 0)
  }

  toggle = () => {
    this.visible = !this.visible
  }
}