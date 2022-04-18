import config from '../common/Config'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import TextLink from './TextLink'
import Auth from '../common/Auth'

export type navLink = {
  name: string
  textColor?: number
  linkColor?: number
  linkHoverColor?: number
  maxRoleId?: number
  backgroundColor?: number
  backgroundHoverColor?: number
  callback?: (scene?: Phaser.Scene) => void
}

export default class MainNav extends ContainerWithBg {
  public padding: number

  public constructor(navOptions: ContainerWithBgOptions, navLinks: navLink[]) {
    super(navOptions)

    this.padding = 10
    this.makeNav(navLinks)
    this.makeUserLink()
    this.scene.add.existing(this)
  }

  private makeUserLink(): void {
    const logoutLink: TextLink = new TextLink(
      {
        scene: this.scene,
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        backgroundColor: config.COLOR_GRAY_700,
        backgroundHoverColor: config.COLOR_HINT_PRIMARY,
        clickHandler: () => {
          Auth.logout(() => {
            window.location.reload()
          })
        },
      },
      {
        name: 'Logout',
        linkColor: config.COLOR_HINT_PRIMARY,
        linkHoverColor: 0xffffff,
        backgroundColor: config.COLOR_GRAY_700,
        backgroundHoverColor: config.COLOR_HINT_PRIMARY,
        callback: () => {},
      },
      15
    )
    let xpos = Math.floor(this.width / 2) - Math.ceil(logoutLink.fullWidth / 2)
    logoutLink.setPosition(xpos, 0)
    this.add(logoutLink)

    const name = new TextLink(
      {
        scene: this.scene,
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        backgroundColor: config.COLOR_GRAY_700,
      },
      {
        name: Auth.user?.firstname || '',
      },
      15
    )
    name.setPosition(xpos - name.fullWidth, 0)
    this.add(name)
  }

  public makeNav(navLinks: navLink[]): void {
    const user = Auth.user
    let xpos = this.padding
    navLinks.forEach((link) => {
      if (link.maxRoleId && user?.role_id && user?.role_id > link.maxRoleId) {
        return
      }
      const txtLink = new TextLink(
        {
          scene: this.scene,
          x: 0,
          y: 0,
          height: 0,
          width: 0,
          backgroundColor: link.backgroundColor || config.COLOR_GRAY_700,
          backgroundHoverColor:
            link.backgroundHoverColor || config.COLOR_GRAY_900,
          clickHandler: link.callback,
        },
        link,
        15
      )
      txtLink.setPosition(
        xpos - Math.floor(this.width / 2) + txtLink.fullWidth / 2,
        0
      )
      this.add(txtLink)

      xpos += txtLink.fullWidth + this.padding
    })
  }
}
