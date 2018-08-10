<template>
  <div id="stage-points">
    <canvas id="stage-points-canvas" :style="{
      'width': `${dPR * 100}%`,
      'height': `${dPR * 100}%`,
      'transform': `scale(${1 / dPR})`
    }"></canvas>
  </div>
</template>

<script lang="ts">
import { Component , Vue, Provide } from 'vue-property-decorator'

@Component
export default class Points extends Vue {
  @Provide() private dPR = window.devicePixelRatio
  @Provide() private raf: number | undefined
  @Provide() private gl: WebGLRenderingContext | null = null

  private mounted(): void {
    const canvas = this.$el.querySelector('#stage-points-canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl', { alpha: false }) as WebGLRenderingContext
    this.gl = gl
    this.raf = requestAnimationFrame(this.draw)
  }

  private draw(time: number): void {
    if (this.gl) {
      const gl = this.gl
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
    this.raf = requestAnimationFrame(this.draw)
  }

  private beforeDestory() {
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
  }
}
</script>

<style lang="stylus" scoped>
#stage-points
  position fixed
  top 0
  left 0
  width 100%
  height 100%
</style>
