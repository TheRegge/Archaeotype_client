import config from '~/common/Config'

declare var WebFont: any

export default class PreloadScene extends Phaser.Scene {
  private loadingText
  private loadingBar

  constructor() {
    super({ key: 'preload' })
  }

  preload() {
    const progress = this.add.graphics()

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
      console.log('COMPLETE')
      this.scene.start('login')
    })

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
  }
}
