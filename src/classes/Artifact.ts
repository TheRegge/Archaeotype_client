import Utils from '../common/Utils'
import Config from '../common/Config'

export type ArtifactData = {
  id: string
  mapId: string
  name: string
  coordinatesInMeters: { x: number; y: number }
  imageSizeInPixels: { width: number; height: number }
  weightInGrams: number
  heightInCentimeters: number
  widthCentimeters: number
  displayAngle: number
  isPainting: boolean
  materials: string[]
  src: string
  altSrc: string[]
}
export default class Artifact extends Phaser.GameObjects.Image {
  public constructor(scene: Phaser.Scene, artifactData: ArtifactData) {
    super(
      scene,
      Config.WORLD.origin.x +
        Utils.metersToPixels(artifactData.coordinatesInMeters.x),
      Config.WORLD.origin.y * 2 +
        Utils.metersToPixels(artifactData.coordinatesInMeters.y),
      'artifactPlaceholder'
    )
    this.setData(artifactData)

    this.setOrigin(0.5, 0.5)
    this.setRotation(Utils.degreesToRandian(artifactData.displayAngle))
    Utils.lazzyLoadImage(
      this.scene,
      this,
      'image',
      artifactData.src,
      artifactData.imageSizeInPixels.width,
      artifactData.imageSizeInPixels.height
    )
  }
}
