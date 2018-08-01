export default class CubeMap {
  public texture: WebGLTexture | null

  private gl: WebGL2RenderingContext
  private textureIndex: number
  private size: number

  constructor(gl: WebGL2RenderingContext, size: number, textureIndex: number) {
    this.gl = gl
    this.textureIndex = textureIndex
    this.size = size

    this.texture = gl.createTexture()
    gl.activeTexture(textureIndex)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture)
    for (let i = 0; i < 6; i++) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, size, size, 0, gl.RGB, gl.UNSIGNED_BYTE, null)
    }

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP)

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
  }

  public updateTexture(faces: Array<ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement>) {
    const gl = this.gl
    const textureIndex = this.textureIndex
    const size = this.size

    gl.activeTexture(textureIndex)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture)
    for (let i = 0; i < 6; i++) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, size, size, 0, gl.RGB, gl.UNSIGNED_BYTE, faces[i])
    }

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP)

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
  }
}
