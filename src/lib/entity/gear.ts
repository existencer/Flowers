import gearVsSource from '@/glsl/object/gear/gear.vs'
import gearFsSource from '@/glsl/object/gear/gear.fs'
import { vec3, mat4 } from 'gl-matrix'

const degree = Math.PI / 180
const squareVertex = [
  1.0, 1.0,
  -1.0, 1.0,
  -1.0, -1.0,
  1.0, -1.0
]
import Entity from '@/lib/common/entity'

export default class GearEntity extends Entity {
  private vao: WebGLVertexArrayObject | null
  private UVTexture: WebGLTexture | null
  private GHTexture: WebGLTexture | null
  private uModelMatrixLoc: WebGLUniformLocation | null
  private uTextureLoc: WebGLUniformLocation | null
  private uUVTextureLoc: WebGLUniformLocation | null

  private radius = 100
  private position = vec3.create()
  private rotateZ = 0
  private rotateSpeed = 6
  private modelMatrix = mat4.create()

  constructor(gl: WebGL2RenderingContext, position?: [number, number, number], radius?: number) {
    super(gl, gearVsSource, gearFsSource)

    if (position) {
      this.position = vec3.fromValues(position[0], position[1], position[2])
    }
    if (radius) {
      this.radius = radius
    }

    this.uModelMatrixLoc = gl.getUniformLocation(this.program, 'uModelMatrix')
    this.uTextureLoc = gl.getUniformLocation(this.program, 'uTexture')
    this.uUVTextureLoc = gl.getUniformLocation(this.program, 'uUVTexture')

    const vao = gl.createVertexArray()
    this.vao = vao
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertex), gl.STREAM_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.bindVertexArray(null)

    this.UVTexture = gl.createTexture()
    this.GHTexture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.UVTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 512, 512, 0, gl.RGB, gl.UNSIGNED_BYTE, null)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, this.GHTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 512, 512, 0, gl.RGB, gl.UNSIGNED_BYTE, null)
    gl.generateMipmap(gl.TEXTURE_2D)
  }

  public setUVTexture(url: string) {
    const gl = this.gl
    const UVImage = new Image()
    UVImage.src = url
    UVImage.onload = () => {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this.UVTexture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 512, 512, 0, gl.RGB, gl.UNSIGNED_BYTE, UVImage)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.generateMipmap(gl.TEXTURE_2D)
    }
  }

  public setGHTexture(url: string) {
    const gl = this.gl
    const GHImage = new Image()
    GHImage.src = url
    GHImage.onload = () => {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this.GHTexture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 512, 512, 0, gl.RGB, gl.UNSIGNED_BYTE, GHImage)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.generateMipmap(gl.TEXTURE_2D)
    }
  }

  public setRotateSpeed(speed: number) {
    this.rotateSpeed = speed
  }

  public update(time: number) {
    this.rotateZ = time * this.rotateSpeed / 1000

    const mat = mat4.create()
    mat4.translate(mat, mat, this.position)
    mat4.rotateZ(mat, mat, this.rotateZ * degree)
    mat4.scale(mat, mat, [this.radius, this.radius, this.radius])
    this.modelMatrix = mat
  }

  public draw(): void {
    const gl = this.gl
    gl.useProgram(this.program)

    gl.uniformMatrix4fv(this.uModelMatrixLoc, false, this.modelMatrix)
    gl.uniform1i(this.uTextureLoc, 1)
    gl.uniform1i(this.uUVTextureLoc, 2)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.GHTexture)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, this.UVTexture)

    gl.bindVertexArray(this.vao)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

    gl.bindVertexArray(null)
  }
}
