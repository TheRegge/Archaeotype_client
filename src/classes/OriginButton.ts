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

    this.createIcon()
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

  createIcon = () => {
    const up = (steps: number): [number, number] => [0, -1 * steps]
    const down = (steps: number): [number, number] => [0, steps]
    const left = (steps: number): [number, number] => [-1 * steps, 0]
    const right = (steps: number): [number, number] => [steps, 0]
    const upRight = (steps: number): [number, number] => [steps, -1 * steps]
    const upLeft = (steps: number): [number, number] => [-1 * steps, -1 * steps]
    const downRight = (steps: number): [number, number] => [steps, steps]
    const downLeft = (steps: number): [number, number] => [-1 * steps, steps]

    const oneStep: number = this.width / 10
    let x = 0
    let y = 0

    const steps: [number, number][] = [right(6), down(1), left(4), downRight(6), down(1), left(1), upLeft(6), down(4), left(1), up(6)]
    let points: [number, number][] = [[x, y]];

    for (let i = 0; i < steps.length; i++) {
      x += steps[i][0] * oneStep
      y += steps[i][1] * oneStep
      const point: [number, number] = [x, y]
      points.push(point)
    }

    const icon = new Phaser.GameObjects.Polygon(this.scene, 0, 0, points, 0xFFFFFF, 1)
    this.add(icon)
  }
}