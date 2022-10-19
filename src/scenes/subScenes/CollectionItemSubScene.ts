import BaseSubScene from './BaseSubScene'
import { ArtifactData, UpdatableElement } from '../../common/Types'
import Auth from '../../common/Auth'
import Data from '../../common/Data'

export default class CollectionItemSubScene extends BaseSubScene {
  public elements: UpdatableElement[]

  constructor() {
    super('collectionitem')
    this.elements = []
    if (!Auth.user) {
      this.close()
    }
  }

  initHTML() {
    // @note:
    // Clear keyboard captures so we can enter data into inputs fields,
    // for example, the 'space' is captured by the scene to show outline
    // around artifacts, but we want to be able to type spaces in the notes.
    this.input.keyboard.clearCaptures()
    const { artifactData } = this.data.get('htmlData')
    const rootEl = document.getElementById('collectionitem')

    const imageContainer = rootEl?.querySelector(
      '[data-el="zoomCollectionItem"]'
    ) as HTMLElement
    const img = rootEl?.querySelector(
      '[data-el="zoomImageCollectionItem"]'
    ) as HTMLImageElement

    // reset the save notes button to be disabled
    // (needed when reopening the scene)
    const saveNotesButton = rootEl?.querySelector(
      '[data-el="save_notes_button"]'
    ) as HTMLButtonElement

    saveNotesButton.disabled = true

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
              new Date(result[0].created_at).toLocaleDateString('en-us', {
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
          el: document.querySelector(
            '[data-el="found_notes_input"]'
          ) as HTMLInputElement,
          data: {
            value: result[0].found_notes || '',
            valueType: 'value',
          },
          action: {
            event: 'keyup',
            once: true,
            callback: (e: any) => {
              const button = document.querySelector(
                '[data-el="save_notes_button"]'
              ) as HTMLButtonElement
              button.disabled = false
            },
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
        {
          el: document.querySelector(
            '[data-el="save_notes_button"]'
          ) as HTMLButtonElement,
          data: {
            value: 'Save Notes',
            valueType: 'innerText',
          },
          action: {
            event: 'click',
            callback: (e) => {
              e.preventDefault()

              const artifactData = this.data.get('htmlData')?.artifactData
              // const { onmap_id, quadId } = artifactData
              const onmap_id: number = artifactData.onmap_id as number
              const quad_id: number = artifactData.quadId as number
              const artifact_id = artifactData.id as number
              const user_id = Auth.user?.id || 0
              const notesEl = document.querySelector(
                '[data-el="found_notes_input"]'
              ) as HTMLTextAreaElement
              const found_notes = notesEl.value

              Data.updateCollectionItemNotes(
                user_id,
                onmap_id,
                artifact_id,
                quad_id,
                found_notes
              ).then((result) => {
                if (result?.statusText === 'OK') {
                  this.notifier.success('Notes saved')
                } else {
                  this.notifier.error('Error saving notes')
                }
              })
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
            element.action.callback,
            { once: element.action.once }
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
