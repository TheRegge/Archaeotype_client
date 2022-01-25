import config from '../common/Config'

declare var WebFont: any
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'login' })
  }

  preload() {
    // Current scene assets
    this.load.image('logo', './assets/images/Archaeotype-Logo.png')
    this.load.html('loginForm', './assets/html/loginForm.html')

    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )

    // QuadScene Assets
    this.load.image('terrain', './assets/images/terrains/q1.jpg')
    this.load.image(
      'toplayer-tiles',
      './assets/images/tilesets/tileset-map-164px.png'
    )
    this.load.image(
      'artifactPlaceholder',
      './assets/images/artifacts/onmap/archaeotype-artifact_placeholder.png'
    )

    import(/* webpackChunkName: "QuadScene" */ './QuadScene').then(
      (QuadScene) => {
        this.game.scene.add('quad', QuadScene.default, false)
      }
    )
  }

  create() {
    this.add.image(
      config.VIEWPORT.width / 2,
      config.VIEWPORT.height / 4,
      'logo'
    )
    WebFont.load({
      google: {
        families: ['Cousine'],
      },
      loading: () => {
        console.info('loading fonts')
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
              form.removeListener('click')
              this.scene.start('quad')
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
