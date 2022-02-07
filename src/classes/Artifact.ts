import Utils from '../common/Utils'
import config from '../common/Config'
import { QuadScene } from '../scenes'

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
        cursor: 'pointer',
      })
      this.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerdown)
      this.on(Phaser.GameObjects.Events.DESTROY, this.handleDestroy)
    })
  }

  handlePointerdown = () => {
    // console.log(
    //   this.getData([
    //     'name',
    //     'weightInGrams',
    //     'heightInCentimeters',
    //     'materials',
    //   ])
    // )
    const scene = this.scene as QuadScene
    scene.clickArtifactCallback(this.data.getAll())
  }

  handleDestroy = () => {
    this.removeAllListeners()
  }
}
