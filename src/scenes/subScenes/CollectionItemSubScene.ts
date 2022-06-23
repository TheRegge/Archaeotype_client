import BaseSubScene from './BaseSubScene'
import { UpdatableElement } from '../../common/Types'
import Data from '../../common/Data'

export default class extends BaseSubScene {
  public elements: UpdatableElement[]

  constructor() {
    super('collectionitem')
    this.elements = []
  }

  initHTML() {
    const { artifactData } = this.data.get('htmlData')
    const rootEl = document.getElementById('collectionitem')

    const imageContainer = rootEl?.querySelector(
      '[data-el="zoomCollectionItem"]'
    ) as HTMLElement
    const img = rootEl?.querySelector(
      '[data-el="zoomImageCollectionItem"]'
    ) as HTMLImageElement

    // preload the full image
    // ------------------
    // This is not using PhaserJS's preload, just loading the image
    // in the browser memory because it is for use in html, not as a
    // Phaser image object
    const fullImage = new Image()
    fullImage.src = `${process.env.API_URL}resource/artifacts/full/${artifactData.name}.png`

    Data.getFoundArtifact(artifactData.onmap_id).then((result) => {
      this.data.set('foundArtifact', result[0])

      this.elements = [
        {
          el: document.getElementById('title') as HTMLInputElement,
          data: {
            value: result[0]?.found_label || '',
            valueType: 'innerText',
          },
        },
        {
          el: document.getElementById('found_by') as HTMLInputElement,
          data: {
            value: result[0].username || 'unkowned',
            valueType: 'value',
          },
        },
        {
          el: document.getElementById('found_date') as HTMLInputElement,
          data: {
            value:
              new Date(result[0].date).toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }) || '',
            valueType: 'innerText',
          },
        },
        {
          el: document.getElementById('found_materials') as HTMLInputElement,
          data: {
            value: result[0].found_materials || '',
            valueType: 'innerText',
          },
        },
        {
          el: document.getElementById('found_notes') as HTMLInputElement,
          data: {
            value: result[0].found_notes || '',
            valueType: 'innerText',
          },
        },
        {
          el: document.getElementById('found_colors') as HTMLInputElement,
          data: {
            value: result[0].found_colors || '',
            valueType: 'innerText',
          },
        },
        {
          el: document.getElementById('found_column') as HTMLInputElement,
          data: {
            value: result[0].found_column || '',
            valueType: 'value',
          },
        },
        {
          el: document.getElementById('found_row') as HTMLInputElement,
          data: {
            value: result[0].found_row || '',
            valueType: 'value',
          },
        },
        {
          el: document.getElementById('found_width') as HTMLInputElement,
          data: {
            value: result[0].found_width || '',
            valueType: 'value',
          },
        },
        {
          el: document.getElementById('found_height') as HTMLInputElement,
          data: {
            value: result[0].found_height || '',
            valueType: 'value',
          },
        },
        {
          el: document.getElementById('found_weight') as HTMLInputElement,
          data: {
            value: result[0].found_weight || '',
            valueType: 'value',
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

      img.src = `${process.env.API_URL}resource/artifacts/preview/${artifactData.fileName}.png`
      imageContainer.onmousemove = (event) => zoom(event)
      imageContainer.onmouseout = () => stopZoom()
    })

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
