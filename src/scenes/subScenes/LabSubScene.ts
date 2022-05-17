import BaseSubScene from '../subScenes/BaseSubScene'
import { UpdatableElement } from '../../common/Types'
import Config from '../../common/Config'
import Auth from '../../common/Auth'
import Data from '../../common/Data'
import Artifact from '../../classes/Artifact'
export default class LabSubScene extends BaseSubScene {
  public elements: UpdatableElement[]
  public artifactOnMap: Artifact | null = null

  constructor() {
    super('lab')
    this.elements = []
    // this.game.input.keyboard.enabled = false
    if (!Auth.user) {
      this.close()
    }
  }

  initHTML() {
    this.input.keyboard.clearCaptures()
    const { artifact, artifactData, tile } = this.data.get('htmlData')
    this.artifactOnMap = artifact

    this.data.set('formData', {
      onmap_id: artifactData.onmap_id,
      artifact_id: artifactData.id * 1,
      quad_id: artifactData.quadId * 1,
      user_id: Auth.user?.id ? Auth.user?.id * 1 : 0,
      fields: {
        found_row: tile.row,
        found_column: tile.column * 1,
        found_weight: artifactData.weightInGrams,
        found_height: artifactData.height,
        found_width: artifactData.width,
        found_materials: artifactData.materials,
      },
    })

    let materialsArray = new Array()

    artifactData.materials?.map((material) => {
      materialsArray.push(material.name)
    })

    const materialsString = materialsArray.join(', ')

    this.elements = [
      {
        el: document.getElementById('label') as HTMLInputElement,
        data: {
          value: artifactData.found_label || '',
          valueType: 'value',
        },
        action: {
          event: 'change',
          callback: (e: any) => {
            const data = this.data.get('formData')
            data.fields.found_label = e.target.value
            this.data.set('formData', data)
          },
        },
      },
      {
        el: document.getElementById('foundBy') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: Auth.user?.firstname || '',
        },
      },
      {
        el: document.getElementById('weight') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifactData.weightInGrams / 1000 + '',
        },
      },
      {
        el: document.getElementById('height') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifactData.height,
        },
      },
      {
        el: document.getElementById('width') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifactData.width,
        },
      },
      {
        el: document.getElementById('row') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: tile.row,
        },
      },
      {
        el: document.getElementById('column') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: tile.column,
        },
      },
      {
        el: document.getElementById('colors') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: '',
        },
        action: {
          event: 'change',
          callback: (e: any) => {
            const data = this.data.get('formData')
            data.fields.found_colors = e.target.value
            this.data.set('formData', data)
          },
        },
      },
      {
        el: document.getElementById('materials') as HTMLSpanElement,
        data: {
          valueType: 'innerText',
          value: materialsString,
        },
      },
      {
        el: document.getElementById('notes') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: '',
        },
        action: {
          event: 'change',
          callback: (e: any) => {
            const data = this.data.get('formData')
            data.fields.found_notes = e.target.value
            this.data.set('formData', data)
          },
        },
      },
      {
        el: document.querySelector('button.submit') as HTMLButtonElement,
        data: {
          valueType: 'innerText',
          value: 'Submit!',
        },
        action: {
          event: 'click',
          callback: async () => {
            const formData = this.data.get('formData')
            const materials: string[] = []
            formData.fields.found_materials.map((material) => {
              materials.push(material.name)
            })
            formData.fields.found_materials = materials.join(', ')

            const result = await Data.saveLabData(
              formData.onmap_id * 1,
              formData.artifact_id,
              formData.quad_id,
              formData.user_id,
              Auth.user?.username || '',
              formData.fields
            )
            if (result) {
              this.artifactOnMap?.showFlag()
              this.close()
            } else {
              // TODO: handle error
              console.error('Lab data was not saved')
            }
          },
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

    const submit = document.querySelector('button.cancel') as HTMLButtonElement
    submit.onclick = () => {
      this.close()
    }

    const imageContainer = document.querySelector('.zoom') as HTMLElement
    const img = document.getElementById('zoomImage') as HTMLImageElement
    img.src = `${process.env.API_URL}resource/artifacts/preview/${artifactData.fileName}.png`

    imageContainer.onmousemove = (event) => zoom(event)
    imageContainer.onmouseout = () => stopZoom()

    const stopZoom = () => {
      imageContainer.style.backgroundImage = 'none'
    }

    const zoom = (e: MouseEvent | TouchEvent) => {
      imageContainer.style.backgroundImage = `url("${process.env.API_URL}resource/artifacts/full/${artifactData.fileName}.png")`

      let imageZoom = e.currentTarget as HTMLDivElement
      let offsetX
      let offsetY

      if (e instanceof MouseEvent) {
        offsetX = e.offsetX
        offsetY = e.offsetY
      } else if (e instanceof TouchEvent) {
        offsetX = e.touches[0].pageX
        offsetY = e.touches[0].pageY
      }

      let x = (offsetX / imageZoom.offsetWidth) * 100
      let y = (offsetY / imageZoom.offsetHeight) * 100

      imageZoom.style.backgroundPosition = `${x}% ${y}%`
    }
  }
}
