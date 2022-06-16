import { IToggle } from '../common/Interfaces'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import ToolbarButton from './ToolbarButton'
import Config from '../common/Config'
import ArtifactsChooser from './ArtifactsChooser'
import { QuadScene } from '../scenes'
import { QuadPointerState } from '../common/Types'

export default class AdminTools extends ContainerWithBg implements IToggle {
  public buttonWidth: number
  public buttonHeight: number
  public artifactsChooser: ArtifactsChooser | null = null
  public topY: number
  public padding: number
  public toolStateCache: QuadPointerState = 'edit'
  private _buttons: ToolbarButton[] = []
  private _buttonCount: number = 0

  public constructor(options: ContainerWithBgOptions) {
    super(options)
    this.topY = 0 - this.height / 2 + this.width / 4
    this.padding = this.width / 4
    this.buttonWidth = this.width / 2
    this.buttonHeight = this.width / 2

    this.addButton(
      new ToolbarButton(
        this,
        '\u2725',
        this._buttonCount++,
        () => {
          const quadScene = this.scene as QuadScene
          quadScene.togglePointerState('edit')
        },
        true
      )
    )

    this.addButton(
      new ToolbarButton(this, '+', this._buttonCount++, () => {
        const quadScene = this.scene as QuadScene
        quadScene.artifactsChooser?.toggle()
        quadScene.togglePointerState('add')
      })
    )

    this.addButton(
      new ToolbarButton(this, '-', this._buttonCount++, () => {
        const quadScene = this.scene as QuadScene
        quadScene.togglePointerState('delete')
      })
    )

    // this.addButton(
    //   new ToolbarButton(this, '\u{27F3}', this._buttonCount++, () => {
    //     const quadScene = this.scene as QuadScene
    //     quadScene.togglePointerState('rotate')
    //   })
    // )

    this.init()
  }

  init() {
    this._buttons.map((button) => {
      this.add(button)
    })
  }

  addButton(button: ToolbarButton) {
    this._buttons.push(button)
  }

  selectTool(selectedButton: ToolbarButton) {
    this._buttons.forEach((button) => {
      if (selectedButton.getData('index') === button.getData('index')) {
        return
      }
      if (button.selected) {
        button.pointerDown()
        button.toggle()
      }
    })
  }

  toggle = () => {
    this.visible = !this.visible
  }
}
