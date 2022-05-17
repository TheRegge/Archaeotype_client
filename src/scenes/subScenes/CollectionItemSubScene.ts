import BaseSubScene from './BaseSubScene'
import { UpdatableElement } from '../../common/Types'
import Data from '../../common/Data'

export default class extends BaseSubScene {
  public elements: UpdatableElement[]

  constructor() {
    super('collectionitem')
    this.elements = []
  }

  async initHTML() {
    const { artifactData } = this.data.get('htmlData')

    console.log(artifactData)

    const result = await Data.getFoundArtifact(artifactData.onmap_id)
    console.log(result[0]['found_label'])

    this.data.set('foundArtifact', result[0])

    this.elements = [
      {
        el: document.getElementById('title') as HTMLInputElement,
        data: {
          value: result[0].found_label || '',
          valueType: 'innerText',
        },
      },
    ]

    this.elements.forEach((element) => {
      if (element.data) {
        element.el[element.data.valueType] = element.data.value
      }

      if (element.action) {
        this.eventsCancellables.push(element.el)
        element.el.addEventListener(
          element.action.event,
          element.action.callback
        )
      }
    })
  }
}
