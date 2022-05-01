import { IToggle, IGetBounds } from '../common/Interfaces'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import Data from '../common/Data'
import ArtifactInChooser from './ArtifactInChooser'
import ScrollButton from './ScrollButton'
import Config from '../common/Config'

export default class ArtifactsChooser
  extends ContainerWithBg
  implements IToggle, IGetBounds
{
  public scrollUpButton: ScrollButton | null
  public scrollDownButton: ScrollButton | null
  public artifactsContainer: Phaser.GameObjects.Container | null

  public constructor(options: ContainerWithBgOptions) {
    super(options)
    this.setInteractive({
      hitArea: this.background,
    })
    this.scene.input.setDraggable(this)

    const scrollButtonWidth = 20
    const scrollButtonHeight = 20
    const borderPadding = 10

    this.scrollUpButton = new ScrollButton({
      scene: this.scene,
      x: this.width / 2 - scrollButtonWidth - borderPadding,
      y: 0 - this.height / 2 + borderPadding,
      width: scrollButtonWidth,
      height: scrollButtonHeight,
      backgroundColor: Config.COLOR_HINT_PRIMARY,
      backgroundOverColor: Config.COLOR_HINT_SECONDARY,
      clickHandler: () => {
        this.artifactsContainer?.setPosition(
          this.artifactsContainer.x,
          this.artifactsContainer.y + 130 / 2
        )
      },
    })

    this.scrollDownButton = new ScrollButton({
      scene: this.scene,
      x: this.width / 2 - scrollButtonWidth - borderPadding,
      y: this.height / 2 - scrollButtonHeight - borderPadding,
      width: scrollButtonWidth,
      height: scrollButtonHeight,
      backgroundColor: Config.COLOR_HINT_PRIMARY,
      backgroundOverColor: Config.COLOR_HINT_SECONDARY,
      clickHandler: () => {
        this.artifactsContainer?.setPosition(
          this.artifactsContainer.x,
          this.artifactsContainer.y - 130 / 2
        )
      },
    })

    this.artifactsContainer = new Phaser.GameObjects.Container(this.scene, 0, 0)
    this.add(this.artifactsContainer)

    this.add(this.scrollUpButton)
    this.add(this.scrollDownButton)
    this.getArtifacts()
    // this.panel.layout()
  }

  getBounds = () => {
    return this.background.getBounds()
  }

  getArtifacts = async () => {
    Data.getAllArtifracts()
      .then(({ artifacts }) => {
        let offset = 0
        const padding = 20
        const smallPadding = 5

        artifacts.forEach(({ id, name, width, height }) => {
          const artifactData = {
            id,
            name,
            width: width,
            height: height,
            originX: 0 - this.width / 2 + padding,
            originY: offset + padding - this.height / 2,
          }
          const artifact = new ArtifactInChooser(
            {
              scene: this.scene,
              x: 0 - this.width / 2 + padding,
              y: offset + padding - this.height / 2,
              width: this.width - padding * 2 - 30,
              height: 100 + smallPadding * 2,
              backgroundColor: 0xdddddd,
              backgroundOpacity: 1,
              backgroundOverColor: 0xffffff,
              backgroundOverOpacity: 1,
              clickHandler: () => {
                // this.scene.events.emit('artifact-choosed', artifactData)
              },
            },
            artifactData
          )

          // artifact.setPosition(0, offset)
          artifact.setInteractive()
          this.scene.input.setDraggable(artifact)
          // artifact.setOrigin(0)
          // let container = this as Phaser.GameObjects.Container
          this.artifactsContainer?.add(artifact)
          // this.panel.add(artifact)
          offset += 100 + padding + smallPadding * 2
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  toggle = () => {
    this.visible = !this.visible
  }
}
