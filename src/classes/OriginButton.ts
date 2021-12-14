import SiteScene from "~/scenes/SiteScene"
export default class OriginButton extends Phaser.GameObjects.Rectangle {

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
    this.on('pointerdown', this.clickHandler)
    this.scene.add.existing(this)
  }

  clickHandler = () => {
    const scene = this.scene as SiteScene
    scene.player.setPosition(0, 0)
  }
}