import config from '~/common/Config'

declare var WebFont: any
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super('Loading')
  }

  preload() {
    this.load.setPath('/assets/')

    // Current scene assets
    this.load.image('logo', 'images/Archaeotype-Logo.png')
    this.load.html('loginForm', 'html/loginForm.html')

    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )

    // SiteScene Assets
    this.load.image('terrain', 'images/terrains/q1.jpg')
    this.load.image('toplayer-tiles', 'images/tilesets/tileset-map-164px.png')

    import(/* webpackChunkName: "siteScene" */ './SiteScene').then(
      (SiteScene) => {
        this.game.scene.add('site', SiteScene.default, false)
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
              this.scene.start('site')
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
