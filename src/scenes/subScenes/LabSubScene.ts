import BaseSubScene from '../subScenes/BaseSubScene'
import { UpdatableElement } from '../../common/Types'
import Config from '../../common/Config'
import Auth from '../../common/Auth'
import Data from '../../common/Data'
import Artifact from '../../classes/Artifact'
import QuadScene from '../QuadScene'
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
    // @note:
    // Clear keyboard captures so we can enter data into inputs fields,
    // for example, the 'space' is captured by the scene to show outline
    // around artifacts, but we want to be able to type spaces in the notes.
    this.input.keyboard.clearCaptures()
    const { artifact, artifactData, tile } = this.data.get('htmlData')
    this.artifactOnMap = artifact

    // preload the full image
    // ------------------
    // This is not using PhaserJS's preload, just loading the image
    // in the browser memory because it is for use in html, not as a
    // Phaser image object
    const fullImage = new Image()
    fullImage.src = `${process.env.API_URL}resource/artifacts/full/${artifactData.name}.png`

    this.data.set('formData', {
      onmap_id: artifactData.onmap_id,
      artifact_id: artifactData.id * 1,
      quad_id: artifactData.quadId * 1,
      user_id: Auth.user?.id ? Auth.user?.id * 1 : 0,
      fields: {
        found_row: tile.row,
        found_column: tile.column * 1,
        found_weight: artifactData.weight,
        found_height: artifactData.height,
        found_width: artifactData.width,
        found_materials: artifactData.materials,
        found_label: artifactData.found_label,
        found_colors: artifactData.found_colors,
        found_notes: artifactData.found_notes,
      },
    })

    let materialsArray = new Array()

    artifactData.materials?.map((material: any) => {
      materialsArray.push(material.name)
    })

    const materialsString = materialsArray.join(', ')

    this.elements = [
      {
        el: document.querySelector('[data-el="label"]') as HTMLInputElement,
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
        el: document.querySelector('[data-el="foundBy"]') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: Auth.user?.firstname || '',
        },
      },
      {
        el: document.querySelector('[data-el="weight"]') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifactData.weight ? artifactData.weight + '' : '',
        },
      },
      {
        el: document.querySelector('[data-el="height"]') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifactData.height ? artifactData.height : '',
        },
      },
      {
        el: document.querySelector('[data-el="width"]') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifactData.width ? artifactData.width : '',
        },
      },
      {
        el: document.querySelector('[data-el="row"]') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: tile.row,
        },
      },
      {
        el: document.querySelector('[data-el="column"]') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: tile.column,
        },
      },
      {
        el: document.querySelector('[data-el="colors"]') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifactData.found_colors || '',
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
        el: document.querySelector('[data-el="materials"]') as HTMLSpanElement,
        data: {
          valueType: 'innerText',
          value: materialsString,
        },
      },
      {
        el: document.querySelector('[data-el="notes"]') as HTMLInputElement,
        data: {
          valueType: 'value',
          value: artifactData.found_notes || '',
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
        el: document.querySelector('[data-el="submit"]') as HTMLButtonElement,
        data: {
          valueType: 'innerText',
          value: 'Submit',
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

            Data.saveLabData(
              formData.onmap_id * 1,
              formData.artifact_id,
              this.data.get('htmlData').artifactData.siteId,
              this.data.get('htmlData').artifactData.projectId,
              formData.quad_id,
              formData.user_id,
              Auth.user?.username || '',
              formData.fields
            ).then((data) => {
              if (data?.data?.id > 0) {
                this.artifactOnMap?.showFlag()
                this.notifier.success('The Artifact was saved successfully')

                // update the duplicate Artifacts cache in the Quad
                // with the name chosen by the user
                const quad =  this.game.scene.getScene('quad') as QuadScene
                quad.updateDuplicateArtifactsCache(
                  this.data.get('htmlData').artifactData.id,
                  formData.fields
                )

                this.close()
              } else if (data?.error) {
                alert(data.error)
                this.close()
              } else {
                alert('Error saving found artifact')
                this.close()
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
          element.action.callback
        )
      }
    })

    const submit = document.querySelector(
      '[data-el="cancel"]'
    ) as HTMLButtonElement
    submit.onclick = () => {
      this.close()
    }

    const imageContainer = document.querySelector(
      '[data-el="zoomLab"]'
    ) as HTMLElement
    const img = document.querySelector(
      '[data-el="zoomImageLab"]'
    ) as HTMLImageElement

    let currentFilename = artifactData.name + '.png'
    let imageIndex = 0

    img.src = `${process.env.API_URL}resource/artifacts/preview/${currentFilename}`

    // Deal with alternate images
    const nextLeft = document.querySelector(
      '[data-el="next-left"]'
    ) as HTMLElement
    const nextRight = document.querySelector(
      '[data-el="next-right"]'
    ) as HTMLElement
    if (!artifactData?.alternateImages?.length) {
      nextLeft.style.display = 'none'
      nextRight.style.display = 'none'
    } else {
      const imageQueue = [currentFilename]
      artifactData.alternateImages.map((image) => {
        imageQueue.push(image.filename)
      })

      nextLeft.onclick = () => {
        imageIndex--
        if (imageIndex < 0) {
          imageIndex = imageQueue.length - 1
        }
        currentFilename = imageQueue[imageIndex]
        img.src = `${process.env.API_URL}resource/artifacts/preview/${currentFilename}`
      }

      nextRight.onclick = () => {
        imageIndex++
        if (imageIndex >= imageQueue.length) {
          imageIndex = 0
        }
        currentFilename = imageQueue[imageIndex]
        img.src = `${process.env.API_URL}resource/artifacts/preview/${currentFilename}`
      }
    }

    imageContainer.onmousemove = (event) => zoom(event)
    imageContainer.onmouseout = () => stopZoom()

    const stopZoom = () => {
      imageContainer.style.backgroundImage = 'none'
    }

    const zoom = (e: MouseEvent | TouchEvent) => {
      imageContainer.style.backgroundImage = `url("${process.env.API_URL}resource/artifacts/full/${currentFilename}")`
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
