import { MINIMAP_SCALE } from "~/main"
export default class Player extends Phaser.GameObjects.Rectangle {
  private static instance: Player
  public scene: Phaser.Scene

  private constructor(scene: Phaser.Scene, width: number, height: number) {

    super(scene, width / 2, height / 2, width, height, 0xFF5555, 0.3)

    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
  }

  public static getInstance(scene: Phaser.Scene, width: number, height: number): Player {
    if (!Player.instance) {
      Player.instance = new Player(scene, width, height)
      const body = Player.instance.body as Phaser.Physics.Arcade.Body
      body.setCollideWorldBounds(true)

      // Player.instance.setStrokeStyle(MINIMAP_SCALE, 0xFF5555, 1)

      Player.instance.setInteractive()
      scene.input.setDraggable(Player.instance)
      scene.input.on('drag', function (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.Physics.Arcade.Body,
        dragX: number,
        dragY: number
      ) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });

      // scene.input.on('gameobjectdown', (e) => {
      //   console.log(e)
      // })
    }
    return Player.instance
  }

  moveLeft(speed: number) {
    const body = Player.instance.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(-1 * Math.abs(speed))
  }

  moveRight(speed: number) {
    const body = Player.instance.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(Math.abs(speed))
  }

  moveUp(speed: number) {
    const body = Player.instance.body as Phaser.Physics.Arcade.Body
    body.setVelocityY(-1 * Math.abs(speed))
  }

  moveDown(speed: number) {
    const body = Player.instance.body as Phaser.Physics.Arcade.Body
    body.setVelocityY(Math.abs(speed))
  }


}