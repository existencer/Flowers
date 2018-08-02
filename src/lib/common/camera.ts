import { mat4 } from 'gl-matrix'

const unitMat4 = mat4.create()

export default class Camera {
  private gl: WebGLRenderingContext
  private viewMat4: mat4
  private projMat4: mat4

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
    this.viewMat4 = unitMat4
    this.projMat4 = unitMat4
  }

  public setMat4(viewMat4?: mat4, projMat4?: mat4) {
    if (viewMat4) {
      this.viewMat4 = viewMat4
    }
    if (projMat4) {
      this.projMat4 = projMat4
    }
  }


  public toUniform(viewLoc: WebGLUniformLocation | null, projLoc: WebGLUniformLocation | null) {
    const gl = this.gl
    gl.uniformMatrix4fv(viewLoc, false, this.viewMat4)
    gl.uniformMatrix4fv(projLoc, false, this.projMat4)
  }
}
