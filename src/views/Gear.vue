<template>
  <div id="stage-gear">
    <canvas id="stage-gear-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component , Vue, Provide } from 'vue-property-decorator'
import { mat4 } from 'gl-matrix'
import GearEntity from '@/lib/entity/gear'
import Camera from '@/lib/common/camera'

@Component
export default class Gear extends Vue {
  @Provide() private title: string = 'Gear'
  @Provide() private raf: number | undefined
  @Provide() private gl: WebGLRenderingContext | null = null

  private mounted(): void {
    const canvas = this.$el.querySelector('#stage-gear-canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl', { alpha: false }) as WebGLRenderingContext
    this.gl = gl

    const gear1 = new GearEntity(gl, [0, 200, 0], 200)
    gear1.setRotateSpeed(10)
    gear1.setGHTexture(require('@/assets/gear/gear_0.gh.jpg'))
    gear1.setUVTexture(require('@/assets/gear/gear_0.uv.jpg'))

    const gear2 = new GearEntity(gl, [198, -108, 0], 200)
    gear2.setRotateSpeed(-10)
    gear2.setRotateOffset(2.5)
    gear2.setGHTexture(require('@/assets/gear/gear_0.gh.jpg'))
    gear2.setUVTexture(require('@/assets/gear/gear_0.uv.jpg'))

    const camera = new Camera(gl)

    const render = (time: number) => {
      gl.canvas.width = gl.canvas.clientWidth
      gl.canvas.height = gl.canvas.clientHeight
      gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight)
      gl.clearColor(1.0, 1.0, 1.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const viewMat4 = mat4.create()
      const projectionMat4 = mat4.create()
      mat4.lookAt(viewMat4, [0, 0, 5], [0, 0, 0], [0, 1, 0])
      mat4.ortho(projectionMat4,
        -gl.canvas.clientWidth / 2, gl.canvas.clientWidth / 2,
        -gl.canvas.clientHeight / 2, gl.canvas.clientHeight / 2,
        0.1, 10)

      camera.setMat4(viewMat4, projectionMat4)

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      gear1.update(time)
      gear2.update(time)

      gear1.draw(camera)
      gear2.draw(camera)

      this.raf = requestAnimationFrame(render)
    }
    this.raf = requestAnimationFrame(render)
  }

  private beforeDestroy(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
  }
}
</script>

<style lang="stylus" scoped>
#stage-gear
  position fixed
  top 0
  left 0
  width 100%
  height 100%
#stage-gear-canvas
  width 100%
  height 100%
</style>
