export function loadCubemap(gl: WebGL2RenderingContext, faces: HTMLImageElement[], textureIndex: number): WebGLTexture {
  const texture = gl.createTexture() as WebGLTexture
  gl.activeTexture(textureIndex)
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)
  for (let i = 0; i < faces.length; i++) {
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, faces[i])
  }
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP)

  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)

  return texture
}
