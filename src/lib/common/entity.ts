import { initShaderProgram } from '@/lib/webgl2/shader'
import Camera from '@/lib/common/camera'

export default abstract class Entity {
  protected gl: WebGLRenderingContext
  protected program: WebGLProgram | null

  constructor(gl: WebGLRenderingContext, vs: string, fs: string) {
    this.gl = gl
    this.program = initShaderProgram(gl, vs, fs)
  }

  public abstract draw(camera?: Camera): void
}
