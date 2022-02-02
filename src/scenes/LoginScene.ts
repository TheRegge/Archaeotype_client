import BaseScene from './BaseScene'
import config from '../common/Config'

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
        families: ['Cousine'],
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

            if (this.checkLogin(inputUsername.value, inputPassword.value)) {
              this.transitionOut(() => {
                form.removeListener('click')
                this.scene.start('site')
              })
            } else {
              console.log('bad')
            }
          }
        })
      },
    })
  }

  checkLogin = (username: string, password: string): boolean => {
    return username.toLowerCase() === '' && password === ''
  }
}
