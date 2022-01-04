import { VIEWPORT } from '../main'

declare var WebFont: any
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super('Loading')
  }

  preload() {
    this.load.setPath('/assets/')

    // Current scene assets
    this.load.image('logo', 'images/Archaeotype-Logo.png')
    this.load.html('startBtn', 'html/startButton.html')
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )

    // SiteScene Assets
    this.load.image('terrain', 'images/terrains/q1.jpg')

    import(/* webpackChunkName: "siteScene" */ './SiteScene').then(
      (SiteScene) => {
        this.game.scene.add('site', SiteScene.default, false)
      }
    )
  }

  create() {
    this.add.image(VIEWPORT.width / 2, VIEWPORT.height / 2 - 80, 'logo')
    WebFont.load({
      google: {
        families: ['Varela Round'],
        text: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      },
      loading: () => {
        console.info('loading fonts')
      },
      active: () => {
        const button = this.add
          .dom(VIEWPORT.width / 2, VIEWPORT.height / 2 + 50)
          .createFromCache('startBtn')

        button.addListener('click')
        button.on('click', () => {
          button.removeListener('click')
          this.scene.start('site')
        })
      },
    })
  }
}
