<template>
  <div>
    <canvas id="canvas" width="1280" height="720"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  mounted() {
    const canvas = this.$el.querySelector('#canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext
    if (!gl) {
      alert('Browser does not support WebGL2, Please use the latest version of Chrome')
      return
    }
    function render(time: number): void {
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      requestAnimationFrame(render)
    }
    render(0)
  }
})
export default class Screen extends Vue {}
</script>
