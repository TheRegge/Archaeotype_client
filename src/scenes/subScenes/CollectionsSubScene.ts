import BaseSubScene from './BaseSubScene'
import Data from '../../common/Data'

export default class CollectionsSubScene extends BaseSubScene {
  constructor() {
    super('collections')
  }

  initHTML() {
    const rootEl = document.getElementById('collections') as HTMLElement
    const itemsContainer = rootEl?.querySelector(
      '[data-el="items-container"]'
    ) as HTMLElement
    const { quad } = this.data.get('htmlData')

    const template = document.getElementById(
      'collections_item_template'
    ) as HTMLTemplateElement
    Data.getProjectCollection(quad.project_id).then((results) => {
      results.map((result) => {
        const item = this.makeCollectionItem(result, template) as Node
        itemsContainer?.append(item)
      })
    })
  }

  stopZoom(container: HTMLElement) {
    if (container) {
      container.style.backgroundImage = 'none'
    }
  }

  zoom(e: MouseEvent | TouchEvent, container: HTMLElement) {
    if (container && container.dataset.bgsrc) {
      container.style.backgroundImage = `url("${container.dataset.bgsrc}`
    }
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

  makeCollectionItem(item, template: HTMLTemplateElement) {
    const collectionItem = document.importNode(template.content, true)

    // Image and zoom
    const imageContainer = collectionItem.querySelector(
      '[data-el="zoomCollectionsItem"]'
    ) as HTMLElement

    imageContainer.onmousemove = (event: MouseEvent | TouchEvent) =>
      this.zoom(event, imageContainer)

    imageContainer.onmouseout = () => this.stopZoom(imageContainer)

    if (imageContainer) {
      imageContainer.dataset.bgsrc = `${process.env.API_URL}resource/artifacts/full/${item.images[0].image_name}.png`
    }

    const img = collectionItem.querySelector(
      '[data-el="zoomImageCollectionsItem"]'
    ) as HTMLImageElement

    let currentFilename = `${item.images[0].image_name}.png`
    let imageIndex = 0

    if (img) {
      img.src = `${process.env.API_URL}resource/artifacts/preview/${currentFilename}`
      img.dataset.currentfilename = currentFilename // for the zoom
    }

    // next and back image buttons
    // for ALTERNATE IMAGES
    const nextLeft = collectionItem.querySelector(
      '[data-el="next-left"]'
    ) as HTMLElement
    const nextRight = collectionItem.querySelector(
      '[data-el="next-right"]'
    ) as HTMLElement

    if (nextLeft && nextRight) {
      if (item.images.length < 2) {
        nextLeft.style.display = 'none'
        nextRight.style.display = 'none'
      }

      nextLeft.onclick = () => {
        imageIndex--
        if (imageIndex < 0) {
          imageIndex = item.images.length - 1
        }
        currentFilename = `${item.images[imageIndex].image_name}.png`
        const parentElement = img.parentElement
        if (parentElement) {
          parentElement.dataset.bgsrc = `${process.env.API_URL}resource/artifacts/full/${currentFilename}`
        }
        img.src = `${process.env.API_URL}resource/artifacts/preview/${currentFilename}`
      }

      nextRight.onclick = () => {
        imageIndex++
        if (imageIndex >= item.images.length) {
          imageIndex = 0
        }
        currentFilename = `${item.images[imageIndex].image_name}.png`
        const parentElement = img.parentElement
        if (parentElement) {
          parentElement.dataset.bgsrc = `${process.env.API_URL}resource/artifacts/full/${currentFilename}`
        }
        img.dataset.currentfilename = currentFilename
        img.src = `${process.env.API_URL}resource/artifacts/preview/${currentFilename}`
      }
    }

    // title
    const title = collectionItem.querySelector('[data-title]')
    if (title) {
      title.textContent = item.found_label
    }

    // quad name
    const quadName = collectionItem.querySelector('[data-quadname]')
    if (quadName) {
      quadName.textContent = item.quad_name
    }

    // date
    const date = collectionItem.querySelector('[data-date]')
    if (date) {
      date.textContent = item.date
    }

    // found by
    const foundBy = collectionItem.querySelector(
      '[data-foundby]'
    ) as HTMLElement
    if (foundBy) {
      foundBy.textContent = item.username
    }

    // Row
    const row = collectionItem.querySelector('[data-row]') as HTMLElement
    if (row) {
      row.textContent = item.found_row
    }

    // Column
    const column = collectionItem.querySelector('[data-column]') as HTMLElement
    if (column) {
      column.textContent = item.found_column
    }

    // Width
    const width = collectionItem.querySelector('[data-width]') as HTMLElement
    if (width) {
      width.textContent = item.found_width
    }

    // height
    const height = collectionItem.querySelector('[data-height]') as HTMLElement
    if (height) {
      height.textContent = item.found_height
    }

    // weight
    const weight = collectionItem.querySelector('[data-weight]') as HTMLElement
    if (weight) {
      weight.textContent = item.found_weight
    }

    // materials
    const materials = collectionItem.querySelector(
      '[data-materials]'
    ) as HTMLElement
    if (materials) {
      materials.textContent = item.found_materials
    }

    // colors
    const colors = collectionItem.querySelector('[data-colors]') as HTMLElement
    if (colors) {
      colors.textContent = item.found_colors
    }

    // Notes
    const notes = collectionItem.querySelector('[data-notes]') as HTMLElement
    if (notes) {
      notes.textContent = item.found_notes
    }

    return collectionItem
  }
}
