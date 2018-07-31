import { vec3, mat4 } from 'gl-matrix'
import RotateXY from '@/lib/common/rotateXY'

const PI = Math.PI / 180
const zeroVec3 = vec3.fromValues(0, 0, 0)
const maxSpeed = 10
const maxRotateSpeed = 140
const playerSpeedHalfDecay = 1 // seccend
const playerSpeedDecay = Math.pow(0.5, playerSpeedHalfDecay / 60)
const playerSpeedup = (1 - playerSpeedDecay) * 60

export default class Player {
  public position: vec3
  public rotate: RotateXY
  public rotateSpeed = 0
  public movement: number[] = []
  private distance = 3
  private signtRotate: RotateXY
  private top = vec3.fromValues(0, 1, 0)
  private speed = 0

  constructor(position: number[], rotate: {x: number, y: number}) {
    this.position = vec3.fromValues(position[0], position[1], position[2])
    this.signtRotate = new RotateXY(rotate.x, rotate.y)
    this.rotate = new RotateXY(rotate.x, rotate.y)
  }

  public update(weight: number) {
    this.speed *= playerSpeedDecay
    this.signtRotate.y += (this.rotate.y - this.signtRotate.y) * 0.03
    this.signtRotate.x += (this.rotate.x - this.signtRotate.x) * 0.03
    if (this.movement[0] === 1) {
      this.speed = this.speed + weight * playerSpeedup / 60
    } else if (this.movement[0] === -1) {
      this.speed = Math.max(-1, this.speed - weight * playerSpeedup / 60)
    }
    this.rotate.y += this.rotateSpeed * weight * maxRotateSpeed / 60
    this.distance = 3 * (1 + this.speed)
    const front = this.getFront()
    const power = weight * maxSpeed * this.speed / 60
    vec3.mul(front, front, [power, power, power])
    vec3.add(this.position, this.position, front)
  }

  public genViewMat4(): mat4 {
    const viewMat4 = mat4.create()
    const eyes = this.getSigntFront(this.distance)
    vec3.sub(eyes, this.position, eyes)
    mat4.lookAt(viewMat4, eyes, this.position, this.top)
    return viewMat4
  }

  public getCenterMat4(): mat4 {
    const centerMat4 = mat4.create()
    mat4.fromTranslation(centerMat4, this.position)
    mat4.rotateY(centerMat4, centerMat4, this.rotate.y * PI)
    mat4.rotateX(centerMat4, centerMat4, this.rotate.x * PI)
    return centerMat4
  }

  public genInvRotateYMat4(): mat4 {
    const InvRotateYMat4 = mat4.create()
    mat4.fromYRotation(InvRotateYMat4, (this.signtRotate.y - 180) * PI)
    return InvRotateYMat4
  }

  private getFront(power?: number): vec3 {
    power = power || 1
    const sight = vec3.fromValues(0, 0, power)
    vec3.rotateX(sight, sight, zeroVec3, this.rotate.x * PI)
    vec3.rotateY(sight, sight, zeroVec3, this.rotate.y * PI)
    return sight
  }

  private getSigntFront(power?: number): vec3 {
    power = power || 1
    const sight = vec3.fromValues(0, 0, power)
    vec3.rotateX(sight, sight, zeroVec3, this.signtRotate.x * PI)
    vec3.rotateY(sight, sight, zeroVec3, this.signtRotate.y * PI)
    return sight
  }
}
