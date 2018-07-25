import Player from '@/lib/game/player'

export default class Ctrl {
  private canvas: HTMLCanvasElement
  private player: Player

  private lastPosY = 0

  constructor(canvas: HTMLCanvasElement, player: Player) {
    this.canvas = canvas
    this.player = player
  }

  public start() {
    this.canvas.addEventListener('mousedown', this.onmousedown)
    this.canvas.addEventListener('mouseup', this.mouseleave)
    this.canvas.addEventListener('mouseleave', this.mouseleave)

    window.addEventListener('keydown', this.onkeydown)
    window.addEventListener('keyup', this.onkeyup)
  }

  public stop() {
    this.canvas.removeEventListener('mousedown', this.onmousedown)
    this.canvas.removeEventListener('mouseup', this.mouseleave)
    this.canvas.removeEventListener('mouseleave', this.mouseleave)

    this.canvas.removeEventListener('mousemove', this.onmousemove)

    window.removeEventListener('keydown', this.onkeydown)
    window.removeEventListener('keyup', this.onkeyup)
  }

  private onmousemove = (e: MouseEvent) => {
    this.player.rotate.x += (e.offsetY - this.lastPosY) / 10
    this.lastPosY = e.offsetY
    this.player.rotateSpeed = (this.canvas.width - e.offsetX * 2) / this.canvas.width
  }
  private onmousedown = (e: MouseEvent) => {
    this.lastPosY = e.offsetY
    this.player.rotateSpeed = (this.canvas.width - e.offsetX * 2) / this.canvas.width
    this.canvas.addEventListener('mousemove', this.onmousemove)
  }
  private mouseleave = () => {
    this.player.rotateSpeed = 0
    this.canvas.removeEventListener('mousemove', this.onmousemove)
  }
  private onkeydown = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'w':
        if (this.player.movement.indexOf(1) === -1) {
          this.player.movement.unshift(1)
        }
        break
      case 's':
        if (this.player.movement.indexOf(-1) === -1) {
          this.player.movement.unshift(-1)
        }
        break
    }
  }
  private onkeyup = (e: KeyboardEvent) => {
    let i = -1
    switch (e.key.toLowerCase()) {
      case 'w':
        i = this.player.movement.indexOf(1)
        break
      case 's':
        i = this.player.movement.indexOf(-1)
        break
    }
    if (i >= 0) {
      this.player.movement.splice(i, 1)
    }
  }
}
