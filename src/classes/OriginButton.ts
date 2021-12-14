import SiteScene from "~/scenes/SiteScene"
import { IToggle } from "./IToggle"
export default class OriginButton extends Phaser.GameObjects.Rectangle implements IToggle {

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor: number = 0x333333,
    opacity: number = 1
  ) {
    super(scene, x, y, width, height, backgroundColor, opacity)
    this.setX(this.x + this.width / 2)
    this.setY(this.y + this.height / 2)
    this.setScrollFactor(0, 0)
    this.setInteractive({ cursor: 'url(assets/images/curor-hand.png), pointer' })
    this.scene.input.keyboard.on('keydown-R', this.toggle)
    this.on('pointerdown', this.clickHandler)
    this.scene.add.existing(this)
  }

  clickHandler = () => {
    const scene = this.scene as SiteScene
    scene.player.setPosition(0, 0)
  }

  toggle = () => {
    this.visible = !this.visible
  }
}