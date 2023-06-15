import BaseSubScene from './BaseSubScene'
import Data from '../../common/Data'
import Auth from '../../common/Auth'
import { UpdatableElement } from '../../common/Types'
import QuadScene from '../QuadScene'

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
      // UNLOCK MAP
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
            const onOk = async () => {
              const result = await Data.unlockQuad(quad.id)

              if (result) {
                if (result.quad_id === quad.id) {
                  // alert('Quad unlocked!')
                  this.notifier.success('Quad unlocked!')
                } else {
                  // alert('Quad already unlocked!')
                  this.notifier.info('Quad already unlocked!')
                }
              } else {
                alert('Something went wrong. Maybe try again?')
                this.notifier.alert('Something went wrong. Maybe try again?')
              }
            }

            this.notifier.confirm(
              'Are you sure you want to unlock the map? The next user editing it will lock it again for others.',
              onOk
            )
          },
        },
      },
      // SAVE HIDDEN TILES
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
            const onOk = async () => {
              const result = await action()
              if (result.data?.success) {
                if (result.data?.numtiles === 0) {
                  this.notifier.info(
                    'No hidden tiles to save! Clear some tiles and the map and try again.'
                  )
                } else {
                  this.notifier.success(
                    `Saved ${result.data?.numtiles} hidden tiles!`
                  )
                }
              } else {
                this.notifier.alert('Something went wrong. Maybe try again?')
              }
            }

            this.notifier.confirm(
              'Are you sure you want to save the cleared tiles? This will overwrite the currently cleared tiles.',
              onOk
            )
          },
        },
      },
      // SOFT RESET QUAD TILES
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
            const onOk = async () => {
              const result = await Data.resetTiles(quad.id)
              if (result.data?.success) {
                if (result.data?.numtiles === 0) {
                  this.notifier.info('There were no tiles to reset!')
                } else {
                  this.notifier.success(`Reset ${result.data?.numtiles} tiles!`)
                  const quadScene = this.game.scene.getScene('quad') as QuadScene
                  quadScene.restartScene(quadScene.pointerState)
                }
              } else {
                this.notifier.alert('Something went wrong. Maybe try again?')
              }
            }

            this.notifier.confirm(
              'Are you sure you want to SOFT reset the map? This will clear all destroyed tiles and keep the hidden tiles.',
              onOk
            )
          },
        },
      },
      // HARD RESET QUAD TILES
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
            const onOk = async () => {
              const result = await Data.resetTiles(quad.id, 'hard')
              if (result.data?.success) {
                if (result.data?.numtiles === 0) {
                  this.notifier.info('There were no tiles to reset!')
                } else {
                  this.notifier.success(`Reset ${result.data?.numtiles} tiles!`)
                  const quadScene = this.game.scene.getScene('quad') as QuadScene
                  quadScene.restartScene(quadScene.pointerState)
                }
              } else {
                this.notifier.alert('Something went wrong. Maybe try again?')
              }
            }

            this.notifier.confirm(
              'Are you sure you want to HARD reset the map? This will ALL the tiles on this map.',
              onOk
            )
          },
        },
      },
      // RANDOMLY ROTATE ARTIFACTS
      {
        el: document.querySelector(
          '[data-el="rotateArtifacts"]'
        ) as HTMLButtonElement,
        data: {
          value: '',
          valueType: 'value',
        },
        action: {
          event: 'click',
          callback: async () => {
            const onOk = async () => {
              const result = await Data.rotateArtifacts(quad.id)
              if (result.data?.success) {
                if (result.data?.numRotated === 0) {
                  this.notifier.info(
                    'There were no artifacts to rotate! (all existing artifacts already have a rotation)'
                  )
                } else {
                  this.notifier.success(
                    `Rotated ${result.data?.numRotated} artifacts!`
                  )
                  const quadScene = this.game.scene.getScene('quad') as QuadScene
                  quadScene.restartScene(quadScene.pointerState)
                }
              } else {
                this.notifier.alert('Something went wrong. Maybe try again?')
              }
            }

            this.notifier.confirm(
              'Are you sure you want to randomly rotate all artifacts?',
              onOk
            )
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
