import { SiteScene } from 'scenes'
import { IToggle } from './IToggle'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
export default class OriginButton extends ContainerWithBg implements IToggle {
  public constructor(options: ContainerWithBgOptions) {
    super(options)

    this.scene.input.keyboard.on('keydown-R', this.toggle)
    this.createIcon()
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

    const steps: [number, number][] = [
      right(6),
      down(1),
      left(4),
      downRight(6),
      down(1),
      left(1),
      upLeft(6),
      down(4),
      left(1),
      up(6),
    ]
    let points: [number, number][] = [[x, y]]

    for (let i = 0; i < steps.length; i++) {
      x += steps[i][0] * oneStep
      y += steps[i][1] * oneStep
      const point: [number, number] = [x, y]
      points.push(point)
    }

    const icon = new Phaser.GameObjects.Polygon(
      this.scene,
      0,
      0,
      points,
      0xffffff,
      1
    )
    // icon.setOrigin(0)
    this.add(icon)
  }
}
