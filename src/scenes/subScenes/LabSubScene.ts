import BaseSubScene from '../subScenes/BaseSubScene'

export default class LabSubScene extends BaseSubScene {
  constructor() {
    super('lab')
  }

  initHTML() {
    const artifact = this.data.get('htmlData')
    const foundByInput = document.getElementById('foundBy') as HTMLInputElement
    foundByInput.value = 'REGIS'

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
