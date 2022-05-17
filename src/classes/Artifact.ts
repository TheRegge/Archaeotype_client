import Utils from '../common/Utils'
import config from '../common/Config'
import { ArtifactData } from '../common/Types'

export default class Artifact extends Phaser.GameObjects.Sprite {
  public constructor(scene: Phaser.Scene, artifactData: ArtifactData) {
    super(
      scene,
      config.WORLD.origin.x +
        Utils.metersToPixels(artifactData.coordinatesInMeters.x),
      config.WORLD.origin.y * 2 +
        Utils.metersToPixels(artifactData.coordinatesInMeters.y),
      'artifactPlaceholder'
    )
    this.name = 'Artifact'

    this.setData(artifactData)
    this.setOrigin(0, 1)
    this.setRotation(Utils.degreesToRandian(artifactData.angle))

    if (this.data.get('isFound') !== true) {
      Utils.lazzyLoadImage(
        this.scene,
        this,
        `${artifactData.name}_${this.scene.scene.key}_${
          this.scene.data.get('quad').id
        }_${artifactData.coordinatesInMeters.x}_${
          artifactData.coordinatesInMeters.y
        }`,
        `${process.env.API_URL}resource/artifacts/onmap/${artifactData.name}.png`,
        artifactData.imageSizeInPixels.width,
        artifactData.imageSizeInPixels.height
      ).then(() => {
        this.on(Phaser.GameObjects.Events.DESTROY, this.handleDestroy)
      })
    } else {
      this.showFlag()
    }
  }

  init = () => {}

  showFlag = () => {
    this.data.set('flag', true)
    this.setOrigin(0, 1)
    this.setTexture('artifactFlag')

    this.scene.input.setHitArea(
      this,
      new Phaser.Geom.Circle(5, 5, 5),
      Phaser.Geom.Circle.Contains
    )
    // this.scene.input.setHitArea(
    //   this,
    //   new Phaser.Geom.Polygon([0, 20, 20, 20, 5, 23, 30, 5, 30, 0, 30, 0, 20]),
    //   Phaser.Geom.Polygon.Contains
    // )
    // this.input.hitArea.setTo(
    //   new Phaser.Geom.Polygon([0, 0, 0, 20, 20, 30, 30, 0, 0, 0])
    // )
    // this.scene.input.enableDebug(this)
  }

  handleDestroy = () => {
    this.removeAllListeners()
  }
}
