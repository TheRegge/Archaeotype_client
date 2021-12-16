/**
 * Singleton class. The Player instantiates a rectangle
 * exactly the size of the visible portion of the terrain. The player
 * is not displayed in the Site scene, but visible on the minimap. The
 * player can move around the site using the arrow keys (and + SHIFT for
 * 4X faster) or by dragging it on the mini map
 *
 */
export default class Player extends Phaser.GameObjects.Rectangle {
  private static instance: Player
  public scene: Phaser.Scene

  /**
   * Creates an instance of player. Since the Player class implements the 'Singleton'
   * pattern, the constructor cannot be directly invoqued. Only one instance of Player
   * can be instanciated, using the static method `Player.getInstance()`
   */
  private constructor(scene: Phaser.Scene, width: number, height: number) {

    super(scene, width / 2, height / 2, width, height, 0xFF5555, 0.3)

    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
  }

  /**
   * Creates or gets the only instance of Player (Singleton pattern)
   */
  public static getInstance(scene: Phaser.Scene, width: number, height: number): Player {
    if (!Player.instance) {
      Player.instance = new Player(scene, width, height)
      const body = Player.instance.body as Phaser.Physics.Arcade.Body
      body.setCollideWorldBounds(true)

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
    }
    return Player.instance
  }

  /**
   * Moves the player left at the passed speed
   */
  moveLeft(speed: number) {
    const body = Player.instance.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(-1 * Math.abs(speed))
  }

  /**
   * Moves the player right at the passed speed
  */
  moveRight(speed: number) {
    const body = Player.instance.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(Math.abs(speed))
  }

  /**
   * Moves the player up at the passed speed
   */
  moveUp(speed: number) {
    const body = Player.instance.body as Phaser.Physics.Arcade.Body
    body.setVelocityY(-1 * Math.abs(speed))
  }

  /**
   * Moves player down at the passed speed
   */
  moveDown(speed: number) {
    const body = Player.instance.body as Phaser.Physics.Arcade.Body
    body.setVelocityY(Math.abs(speed))
  }
}