import BaseSubScene from './BaseSubScene'
import Data from '../../common/Data'
import Auth from '../../common/Auth'
import { UpdatableElement } from '../../common/Types'

export default class ActionsSubScene extends BaseSubScene {
  public elements: UpdatableElement[]
  constructor() {
    super('actions')
    this.elements = []

    if (!Auth.user) {
      this.close()
    }
  }

  initHTML() {
    const { action, quad } = this.data.get('htmlData')

    this.elements = [
      {
        el: document.querySelector(
          '[data-el="unlockMap"]'
        ) as HTMLButtonElement,
        data: {
          value: '',
          valueType: 'value',
        },
        action: {
          event: 'click',
          callback: async (e) => {
            if (
              window.confirm(
                'Are you sure you want to unlock the map? The next user editing it will lock it again for others.'
              )
            ) {
              const result = await Data.unlockQuad(quad.id)
              console.log('result', result)
              if (result) {
                if (result.quad_id === quad.id) {
                  alert('Quad unlocked!')
                } else {
                  alert('Quad already unlocked!')
                }
              } else {
                alert('Something went wrong. Maybe try again?')
              }
            }
          },
        },
      },
      {
        el: document.querySelector(
          '[data-el="saveHiddenTiles"]'
        ) as HTMLButtonElement,
        data: {
          value: '',
          valueType: 'value',
        },
        action: {
          event: 'click',
          callback: async () => {
            if (
              window.confirm(
                'Are you sure you want to save the hidden tiles? This will overwrite the current hidden tiles.'
              )
            ) {
              const result = await action()
              console.log('result', result)
              if (result.data?.success) {
                if (result.data?.numtiles === 0) {
                  console.log('success 0 tiles', result.data)
                  alert(
                    'No hidden tiles to save! Clear some tiles and the map and try again.'
                  )
                } else {
                  console.log('success', result.data)
                  alert(`Saved ${result.data?.numtiles} hidden tiles!`)
                }
              } else {
                console.log('error', result)
                alert('Something went wrong. Maybe try again?')
              }
            }
          },
        },
      },
      {
        el: document.querySelector(
          '[data-el="softResetMap"]'
        ) as HTMLButtonElement,
        data: {
          value: '',
          valueType: 'value',
        },
        action: {
          event: 'click',
          callback: async () => {
            alert('Doing a map soft reset')
          },
        },
      },
      {
        el: document.querySelector(
          '[data-el="hardResetMap"]'
        ) as HTMLButtonElement,
        data: {
          value: '',
          valueType: 'value',
        },
        action: {
          event: 'click',
          callback: async () => {
            alert('Doing a map HARD reset')
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
  }
}
