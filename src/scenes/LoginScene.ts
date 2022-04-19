import BaseScene from './BaseScene'
import config from '../common/Config'
import Auth from '../common/Auth'

import axios from 'axios'
import { errors } from 'jose'

declare var WebFont: any
export default class LoadingScene extends BaseScene {
  constructor() {
    super({ key: 'login' })
  }

  // preload() {
  // assets loaded in PreloadScene
  // }

  create() {
    this.transitionIn()

    this.add.image(
      config.VIEWPORT.width / 2,
      config.VIEWPORT.height / 4,
      'logosvg'
    )
    WebFont.load({
      google: {
        families: [config.GOOGLE_FONT_FAMILY],
      },
      loading: () => {
        // console.info('loading fonts')
      },
      active: () => {
        const form = this.add
          .dom(config.VIEWPORT.width / 2, config.VIEWPORT.height / 2 + 50)
          .createFromCache('loginForm')

        form.addListener('click')
        form.on('click', (e: any) => {
          if (e.target.name === 'loginButton') {
            const inputUsername = form.getChildByID(
              'username'
            ) as HTMLInputElement
            const inputPassword = form.getChildByID(
              'password'
            ) as HTMLInputElement

            const errorsDiv: Element = form.getChildByID('loginErrors')
            Auth.login(
              inputUsername.value,
              inputPassword.value,
              (isLoggedin, data = '') => {
                if (isLoggedin) {
                  this.transitionOut(() => {
                    form.removeListener('click')
                    const user = Auth.user
                    if (Auth.isAdmin()) {
                      this.scene.start('site')
                    } else {
                      this.scene.start('quad')
                    }
                  })
                } else {
                  const errors: string[] = []
                  if (data.data) {
                    for (const item in data.data.messages) {
                      errors.push('* ' + data.data.messages[item])
                    }
                    errorsDiv.innerHTML = errors.join('<br />')
                  }
                }
              }
            )
          }
        })
      },
    })
  }
}
