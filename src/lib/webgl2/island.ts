import { initShaderProgram } from '@/lib/webgl2/shader'

import islandVsSource from '@/glsl/island.vs'
import islandFsSource from '@/glsl/island.fs'

const facings = [
  0.0, 0.0,
  0.0, 1.0,
  1.0, 0.0,

  1.0, 0.0,
  0.0, 1.0,
  1.0, 1.0
]

export default class Island {
  public texturePos: number

  private gl: WebGL2RenderingContext
  private program: WebGLProgram | null
  private vao: WebGLVertexArrayObject | null
  private depthTexture: WebGLTexture | null
  private uPrecisionLoc: WebGLUniformLocation | null
  private uDepthTextureLoc: WebGLUniformLocation | null

  constructor(gl: WebGL2RenderingContext, texturePos: number) {
    this.gl = gl
    this.texturePos = texturePos

    this.program = initShaderProgram(gl, islandVsSource, islandFsSource)!
    this.uPrecisionLoc = gl.getUniformLocation(this.program, 'uPrecision')
    this.uDepthTextureLoc = gl.getUniformLocation(this.program, 'uDepthTexture')

    this.depthTexture = gl.createTexture()
    gl.activeTexture(this.texturePos + gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 512, 512, 0, gl.RGB, gl.UNSIGNED_BYTE, null)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)

    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(facings), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.bindVertexArray(null)
  }

  public draw(gl: WebGL2RenderingContext) {
    gl.enable(gl.DEPTH_TEST)
    gl.useProgram(this.program)
    gl.activeTexture(this.texturePos + gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture)
    gl.uniform1i(this.uDepthTextureLoc, this.texturePos)
    gl.uniform1i(this.uPrecisionLoc, 512)
    gl.bindVertexArray(this.vao)
    // gl.drawArraysInstanced(gl.LINES, 0, 6, 512 * 512)
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, 512 * 512)
    gl.bindVertexArray(null)
  }

  public bindUniformBlock(name: string, index: number) {
    const gl = this.gl
    gl.uniformBlockBinding(this.program!, gl.getUniformBlockIndex(this.program!, name), index)
  }

  public bindDepthTexture(resource: ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) {
    const gl = this.gl
    gl.activeTexture(this.texturePos + gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 512, 512, 0, gl.RGB, gl.UNSIGNED_BYTE, resource)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}
