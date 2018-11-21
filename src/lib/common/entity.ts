import { initShaderProgram } from '@/lib/webgl2/shader'

export default abstract class Entity {
  protected gl: WebGL2RenderingContext
  protected program: WebGLProgram

  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    this.gl = gl
    this.program = initShaderProgram(gl, vs, fs)!
  }

  public bindUniformBlock(name: string, index: number) {
    const gl = this.gl
    gl.uniformBlockBinding(this.program!, gl.getUniformBlockIndex(this.program!, name), index)
  }

  public abstract draw(): void
}
