import BaseSubScene from '../subScenes/BaseSubScene'
type UpdatableElement = {
  el: HTMLElement | HTMLInputElement
  data: { valueType: string; value: string | number }
}
export default class LabSubScene extends BaseSubScene {
  public elements: UpdatableElement[]

  constructor() {
    super('lab')
    this.elements = []
  }

  initHTML() {
    const { artifact, tile } = this.data.get('htmlData')

    this.elements = [
      {
        el: document.getElementById('foundBy') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: 'Someone',
        },
      },
      {
        el: document.getElementById('weight') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifact.weightInGrams / 1000 + '',
        },
      },
      {
        el: document.getElementById('height') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifact.heightInCentimeters / 1000 + '',
        },
      },
      {
        el: document.getElementById('width') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifact.widthInCentimeters / 100 + '',
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
        el: document.getElementById('materials') as HTMLSpanElement,
        data: {
          valueType: 'innerText',
          value: artifact.materials.join(', '),
        },
      },
    ]

    this.elements.forEach((element) => {
      element.el[element.data.valueType] = element.data.value
    })

    const submit = document.querySelector('button.cancel') as HTMLButtonElement
    submit.onclick = () => {
      this.close()
    }

    const imageContainer = document.querySelector('.zoom') as HTMLElement
    const img = document.getElementById('zoomImage') as HTMLImageElement
    img.src = `assets/images/artifacts/huge/${artifact.fileName}.jpg`

    imageContainer.onmousemove = (event) => zoom(event)

    imageContainer.style.backgroundImage = `url("assets/images/artifacts/huge/${artifact.fileName}.jpg")`

    const zoom = (e: MouseEvent | TouchEvent) => {
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
