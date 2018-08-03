import gearVsSource from '@/glsl/object/gear/gear.vs'
import gearFsSource from '@/glsl/object/gear/gear.fs'
import { vec3, mat4, mat2 } from 'gl-matrix'
import Entity from '@/lib/common/entity'
import Camera from '@/lib/common/camera'

const degree = Math.PI / 180

export default class GearEntity extends Entity {
  private symmetry: number

  private vertexBuffer: WebGLBuffer | null
  private rotateZBuffer: WebGLBuffer | null
  private UVTexture: WebGLTexture | null
  private GHTexture: WebGLTexture | null
  private uModelMatLoc: WebGLUniformLocation | null
  private uViewMatLoc: WebGLUniformLocation | null
  private uProjMatLoc: WebGLUniformLocation | null
  private uIsLightOnLoc: WebGLUniformLocation | null
  private uTextureLoc: WebGLUniformLocation | null
  private uUVTextureLoc: WebGLUniformLocation | null

  private aVertexPosLoc: number
  private aRotateZLoc: number

  private radius = 100
  private position = vec3.create()
  private rotateZ = 0
  private rotateSpeed = 6
  private rotateOffset = 0
  private modelMatrix = mat4.create()

  constructor(gl: WebGLRenderingContext, symmetry?: number, position?: [number, number, number], radius?: number) {
    super(gl, gearVsSource, gearFsSource)

    symmetry = symmetry || 4
    this.symmetry = symmetry

    if (position) {
      this.position = vec3.fromValues(position[0], position[1], position[2])
    }
    if (radius) {
      this.radius = radius
    }

    this.aVertexPosLoc = gl.getAttribLocation(this.program, 'aVertexPos')
    this.aRotateZLoc = gl.getAttribLocation(this.program, 'aRotateZ')

    this.uModelMatLoc = gl.getUniformLocation(this.program, 'uModelMatrix')
    this.uViewMatLoc = gl.getUniformLocation(this.program, 'uViewMatrix')
    this.uProjMatLoc = gl.getUniformLocation(this.program, 'uProjectionMatrix')

    this.uIsLightOnLoc = gl.getUniformLocation(this.program, 'uIsLightOn')

    this.uTextureLoc = gl.getUniformLocation(this.program, 'uTexture')
    this.uUVTextureLoc = gl.getUniformLocation(this.program, 'uUVTexture')

    const arg = Math.PI / symmetry
    const r = 1 / Math.cos(arg)
    const vertexPos = [
      0.0, 0.0,
      r * Math.sin(arg), 1.0,
      r * -Math.sin(arg), 1.0
    ]
    const rotateZ: number[] = []
    for (let i = 0; i < this.symmetry; i++) {
      const mat = mat2.create()
      mat2.rotate(mat, mat, 2 * arg * i)
      rotateZ.push(...mat)
    }

    this.vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STREAM_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    this.rotateZBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rotateZBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rotateZ), gl.STREAM_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    this.UVTexture = gl.createTexture()
    this.GHTexture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.UVTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 255]))
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, this.GHTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]))
    gl.generateMipmap(gl.TEXTURE_2D)
  }

  public setUVTexture(url: string) {
    const gl = this.gl
    const UVImage = new Image()
    UVImage.src = url
    UVImage.onload = () => {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this.UVTexture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, UVImage)
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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, GHImage)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.generateMipmap(gl.TEXTURE_2D)
    }
  }

  public setRotateSpeed(speed: number) {
    this.rotateSpeed = speed
  }

  public setRotateOffset(offset: number) {
    this.rotateOffset = offset
  }

  public update(time: number) {
    this.rotateZ = time * this.rotateSpeed / 1000 + this.rotateOffset

    const mat = mat4.create()
    mat4.translate(mat, mat, this.position)
    mat4.rotateZ(mat, mat, this.rotateZ * degree)
    mat4.scale(mat, mat, [this.radius, this.radius, this.radius])
    this.modelMatrix = mat
  }

  public draw(camera: Camera, lightOn?: boolean): void {
    const gl = this.gl
    const ext = gl.getExtension('ANGLE_instanced_arrays') as ANGLE_instanced_arrays
    gl.useProgram(this.program)

    gl.uniformMatrix4fv(this.uModelMatLoc, false, this.modelMatrix)
    camera.toUniform(this.uViewMatLoc, this.uProjMatLoc)
    gl.uniform1i(this.uIsLightOnLoc, lightOn ? 1 : 0)
    gl.uniform1i(this.uTextureLoc, 1)
    gl.uniform1i(this.uUVTextureLoc, 2)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.GHTexture)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, this.UVTexture)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.vertexAttribPointer(this.aVertexPosLoc, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(this.aVertexPosLoc)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.rotateZBuffer)
    gl.vertexAttribPointer(this.aRotateZLoc, 2, gl.FLOAT, false, 16, 0)
    gl.enableVertexAttribArray(this.aRotateZLoc)
    gl.vertexAttribPointer(this.aRotateZLoc + 1, 2, gl.FLOAT, false, 16, 8)
    gl.enableVertexAttribArray(this.aRotateZLoc + 1)
    ext.vertexAttribDivisorANGLE(this.aRotateZLoc, 1)
    ext.vertexAttribDivisorANGLE(this.aRotateZLoc + 1, 1)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    // gl.drawArrays(gl.TRIANGLES, 0, this.symmetry * 3)
    ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 3, this.symmetry)
  }
}
