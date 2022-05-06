import config from '../common/Config'
import Auth from '../common/Auth'

declare var WebFont: any

export default class PreloadScene extends Phaser.Scene {
  private loadingText
  private loadingBar

  constructor() {
    super({ key: 'preload' })
  }

  preload() {
    const progress = this.add.graphics()

    // this.load.setPath('./assets/')

    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(
        0,
        config.VIEWPORT.height / 2,
        config.VIEWPORT.width * value,
        4
      )
    })

    this.load.on('complete', () => {
      progress.destroy()
      // Load google fonts
      WebFont.load({
        google: {
          families: [config.GOOGLE_FONT_FAMILY],
        },
        active: () => {
          if (!Auth.checkLogin()) {
            this.scene.start('login')
          } else {
            if (Auth.isAdmin()) {
              this.scene.start('projects')
            } else {
              this.scene.start('quad')
            }
          }
        },
      })
    })

    // LoginScene Assets
    this.load.svg('logosvg', './assets/images/Archaeotype-logo.svg')
    this.load.html('loginForm', './assets/html/loginForm.html')

    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )

    // SiteScene Assets
    this.load.image('site', './assets/images/terrains/site_1px-2m.jpg')

    // QuadScene Assets
    this.load.image(
      'administrative',
      './assets/images/terrains/bg-administrative.jpg'
    )
    this.load.image('bg-temple', './assets/images/terrains/bg-temple.jpg')
    this.load.image(
      'bg-residences',
      './assets/images/terrains/bg-residences.jpg'
    )
    this.load.image('bg-palace', './assets/images/terrains/bg-palace.jpg')
    this.load.image('bg-industry', './assets/images/terrains/bg-industry.jpg')
    this.load.image(
      'bg-administrative',
      './assets/images/terrains/bg-administrative.jpg'
    )
    this.load.image(
      'toplayer-tiles',
      './assets/images/tilesets/tileset-map-1312_2px.png'
    )

    this.load.json('fakeTiles', './assets/fakeTilesData.json')
    this.load.json('artifacts', './assets/artifacts.json')
    this.load.image(
      'artifactPlaceholder',
      './assets/images/artifacts/onmap/transparent.png'
    )

    // SubScenes
    this.load.html('labForm', './assets/html/labForm.html')
    this.load.html('help', './assets/html/help.html')
    this.load.html('collections', './assets/html/collections.html')
  }
}
