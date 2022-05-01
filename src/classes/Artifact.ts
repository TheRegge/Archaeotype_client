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
    this.setOrigin(0.5, 0.5)
    this.setRotation(Utils.degreesToRandian(artifactData.angle))

    Utils.lazzyLoadImage(
      this.scene,
      this,
      `${artifactData.name}_${artifactData.coordinatesInMeters.x}_${artifactData.coordinatesInMeters.y}`,
      `${config.API_URL}resource/artifacts/onmap/${artifactData.name}.png`,
      artifactData.imageSizeInPixels.width,
      artifactData.imageSizeInPixels.height
    ).then(() => {
      this.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(
          0,
          0,
          artifactData.imageSizeInPixels?.width || 100,
          artifactData.imageSizeInPixels?.height || 100
        ),
        // cursor: 'pointer',
      })

      this.on(Phaser.GameObjects.Events.DESTROY, this.handleDestroy)
    })
  }

  handleDestroy = () => {
    this.removeAllListeners()
  }
}
