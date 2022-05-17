import Utils from '../common/Utils'
import Config from '../common/Config'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'

export default class ArtifactInChooser extends ContainerWithBg {
  public image: Phaser.GameObjects.Image
  public backgroundOpacity: number
  // public originX: number
  // public originY: number

  public constructor(options: ContainerWithBgOptions, data: any) {
    super(options)
    this.name = 'ArtifactInChooser'
    this.setData('artifact', data)
    this.backgroundOpacity = options.backgroundOpacity || 1
    // this.originX = data.originX
    // this.originY = data.originY
    // console.log('artifactInChooser data', data)
    this.image = new Phaser.GameObjects.Image(
      this.scene,
      5 - this.width / 2,
      5 - this.height / 2,
      'artifactPlaceholder',
      0
    )
    this.image.setOrigin(0, 0)
    this.add(this.image)

    const nameText = new Phaser.GameObjects.Text(
      this.scene,
      110 - this.width / 2,
      10 - this.height / 2,
      data.name,
      {
        fontFamily: 'Cousine',
        fontSize: '16px',
        color: '#000000',
      }
    )
    nameText.setOrigin(0, 0)
    this.add(nameText)

    const imageName = data.name
    Utils.lazzyLoadImage(
      this.scene,
      this.image,
      imageName,
      `${process.env.API_URL}resource/artifacts/thumb/${imageName}.png`,
      100,
      100
    ).then(() => {})
  }

  public showDraggingState = () => {
    this.background.setAlpha(0)
  }

  public showStillState = () => {
    this.background.setAlpha(this.backgroundOpacity)
  }
}
