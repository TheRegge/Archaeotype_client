declare var WebFont: any
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super('Loading')
  }

  preload() {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )

    import(/* webpackChunkName: "siteScene" */ './SiteScene').then(
      (SiteScene) => {
        this.game.scene.add('site', SiteScene.default, false)
      }
    )
  }

  create() {
    WebFont.load({
      google: {
        families: ['Varela Round'],
      },
      active: () => {
        this.scene.start('site')
      },
    })
  }
}
