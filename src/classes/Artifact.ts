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
    this.setData(artifactData)
    this.setOrigin(0.5, 0.5)
    this.setRotation(Utils.degreesToRandian(artifactData.displayAngle))

    Utils.lazzyLoadImage(
      this.scene,
      this,
      artifactData.src,
      artifactData.src,
      artifactData.imageSizeInPixels.width,
      artifactData.imageSizeInPixels.height
    ).then(() => {
      this.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
        // cursor: 'pointer',
      })
      this.on(Phaser.GameObjects.Events.DESTROY, this.handleDestroy)
    })
  }

  handleDestroy = () => {
    this.removeAllListeners()
  }
}
