<template>
  <div class="screen">
    <canvas id="canvas" width="1280" height="720"></canvas>
    <div class="status">
      <p>Frame --</p>
      <p>Position</p>
      <p class="sub">x: {{player.position[0].toFixed(3)}}</p>
      <p class="sub">y: {{player.position[1].toFixed(3)}}</p>
      <p class="sub">z: {{player.position[2].toFixed(3)}}</p>
      <p>Rotate</p>
      <p class="sub">x: {{player.rotate.x.toFixed(3)}}</p>
      <p class="sub">y: {{player.rotate.y.toFixed(3)}}</p>
      <p>Lspeed {{player.speed.toFixed(3)}}</p>
      <p>Rspeed {{player.rotateSpeed.toFixed(3)}}</p>
    </div>
    <div @click="render">Render</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { vec3, mat4 } from 'gl-matrix'
import { State } from 'vuex-class'
import { initShaderProgram } from '@/lib/webgl2/shader'
import CubeMap from '@/lib/webgl2/cubemap'
import Player from '@/lib/game/player'
import Ctrl from '@/lib/game/ctrl'

import groundVsSource from '@/glsl/ground.vs'
import groundFsSource from '@/glsl/ground.fs'
import grassVsSource from '@/glsl/grass.vs'
import grassFsSource from '@/glsl/grass.fs'
import centerVsSource from '@/glsl/center.vs'
import centerFsSource from '@/glsl/center.fs'
import centerLineFsSource from '@/glsl/center.line.fs'
import Island from '@/lib/webgl2/island'

const grassCount = 50000
const grassDensity = 400
const grassSlope = 1 / 40
const grassPrecision = 2
const grassOffset: number[] = []
const radius = Math.sqrt(grassCount / grassDensity)
for (let i = 0; i < grassCount; i++) {
  grassOffset.push(
    radius * Math.random() * 2 - radius,
    0.0,
    radius * Math.random() * 2 - radius
  )
}
const grassPointsCount = 2 * grassPrecision + 1
const grassSection = 1 / grassPrecision
const grassVertex: number[] = []
for (let i = 0; i < grassPrecision; i++) {
  const k = i * grassSection
  grassVertex.push(...[-grassSlope * (1 - k * k), k])
  grassVertex.push(...[grassSlope * (1 - k * k), k])
}
grassVertex.push(...[0, 1])

const centerBoxVertex = [
  0.0, 1.0, 0.0,
  1.0, 0.0, 0.0,
  0.0, 0.0, -1.0,
  -1.0, 0.0, 0.0,
  0.0, 0.0, 3.0,
  0.0, -1.0, 0.0
]
const centerBoxVertexIndices = [
  0, 1, 2,
  0, 2, 3,
  0, 3, 4,
  0, 4, 1,
  5, 4, 3,
  5, 3, 2,
  5, 2, 1,
  5, 1, 4
]
const groundVertex = [
  500, 500,
  500, -500,
  -500, 500,
  -500, -500
]
const skyboxVertices = [
  -1.0,  1.0, -1.0,
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
  -1.0,  1.0, -1.0,

  -1.0, -1.0,  1.0,
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
  -1.0, -1.0,  1.0,

   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,

  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0
]

const player = new Player([42.914, 11.812, -35.407], {x: 11.3, y: -29.483})

interface ShaderProgramInfo {
  program: WebGLProgram,
  aLocation?: Array<number | null>
  uLocation?: Array<WebGLUniformLocation | null>
}

@Component
export default class Screen extends Vue {
  @Provide() private player: Player = player
  @Provide() private raf: number | undefined

  @State('assets') private assets?: HTMLImageElement[]

  @Provide() private render = () => {return}

  private mounted(): void {
    const canvas = this.$el.querySelector('#canvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext
    if (!gl) {
      alert('Browser does not support WebGL2, Please use the latest version of Chrome')
      return
    }

    const groundSPI: ShaderProgramInfo = {
      program: initShaderProgram(gl, groundVsSource, groundFsSource) as WebGLProgram
    }
    groundSPI.uLocation = [
      gl.getUniformLocation(groundSPI.program, 'uPlayerPosition'),
      gl.getUniformLocation(groundSPI.program, 'uSkyBoxTexture')
    ]
    gl.uniformBlockBinding(groundSPI.program, gl.getUniformBlockIndex(groundSPI.program, 'uboMatrix'), 1)

    const grassSPI: ShaderProgramInfo = {
      program: initShaderProgram(gl, grassVsSource, grassFsSource) as WebGLProgram
    }
    grassSPI.uLocation = [
      gl.getUniformLocation(grassSPI.program, 'uModelMatrix'),
      gl.getUniformLocation(grassSPI.program, 'uRadius'),
      gl.getUniformLocation(grassSPI.program, 'uCenterPosition'),
      gl.getUniformLocation(grassSPI.program, 'uDepthTexture'),
    ]
    gl.uniformBlockBinding(grassSPI.program, gl.getUniformBlockIndex(grassSPI.program, 'uboMatrix'), 1)
    gl.uniformBlockBinding(grassSPI.program, gl.getUniformBlockIndex(grassSPI.program, 'uboIsland'), 2)

    const centerSPI: ShaderProgramInfo = {
      program: initShaderProgram(gl, centerVsSource, centerFsSource) as WebGLProgram
    }
    centerSPI.uLocation = [gl.getUniformLocation(centerSPI.program, 'uModelMatrix')]
    gl.uniformBlockBinding(centerSPI.program, gl.getUniformBlockIndex(centerSPI.program, 'uboMatrix'), 1)

    const centerLineSPI: ShaderProgramInfo = {
      program: initShaderProgram(gl, centerVsSource, centerLineFsSource) as WebGLProgram
    }
    centerLineSPI.uLocation = [gl.getUniformLocation(centerLineSPI.program, 'uModelMatrix')]
    gl.uniformBlockBinding(centerLineSPI.program, gl.getUniformBlockIndex(centerLineSPI.program, 'uboMatrix'), 1)

    const groundVAO = gl.createVertexArray()
    gl.bindVertexArray(groundVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundVertex), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyboxVertices), gl.STATIC_DRAW)
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(1)
    gl.bindVertexArray(null)

    const grassVAO = gl.createVertexArray()
    gl.bindVertexArray(grassVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grassVertex), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grassOffset), gl.STATIC_DRAW)
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(1)
    gl.vertexAttribDivisor(1, 1)
    gl.bindVertexArray(null)

    const centerVAO = gl.createVertexArray()
    gl.bindVertexArray(centerVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(centerBoxVertex), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(centerBoxVertexIndices), gl.STATIC_DRAW)
    gl.bindVertexArray(null)

    const uboMatrices = gl.createBuffer()
    gl.bindBuffer(gl.UNIFORM_BUFFER, uboMatrices)
    gl.bufferData(gl.UNIFORM_BUFFER, 128, gl.STATIC_DRAW)
    gl.bindBuffer(gl.UNIFORM_BUFFER, null)
    gl.bindBufferRange(gl.UNIFORM_BUFFER, 1, uboMatrices, 0, 128)

    const uboIsland = gl.createBuffer()
    gl.bindBuffer(gl.UNIFORM_BUFFER, uboIsland)
    gl.bufferData(gl.UNIFORM_BUFFER, 16, gl.STATIC_DRAW)
    gl.bindBuffer(gl.UNIFORM_BUFFER, null)
    gl.bindBufferRange(gl.UNIFORM_BUFFER, 2, uboIsland, 0, 16)

    const cubeSky = new CubeMap(gl, 512, gl.TEXTURE0)
    this.$store.dispatch('loadResource').then(() => {
      cubeSky.updateTexture(this.assets!)
    })

    const island = new Island(gl, 1)
    island.bindUniformBlock('uboMatrix', 1)
    island.bindUniformBlock('uboIsland', 2)
    const islandDepth = new Image()
    islandDepth.src = require('@/assets/island.png')
    islandDepth.onload = () => {
      island.bindDepthTexture(islandDepth)
    }

    let lastTime: number
    const render = (time: number): void => {
      time *= 0.001
      if (!lastTime) {
        lastTime = time
      }
      const deltaTime = time - lastTime
      lastTime = time

      player.update(deltaTime * 60)

      const viewMat4 = player.genViewMat4()
      const centerMat4 = player.getCenterMat4()
      const invRotateYMat4 = player.genInvRotateYMat4()
      const fieldOfView = 45 * Math.PI / 180
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
      const zNear = 0.1
      const zFar = 500.0
      const projectionMat4 = mat4.create()
      mat4.perspective(projectionMat4, fieldOfView, aspect, zNear, zFar)

      gl.bindBuffer(gl.UNIFORM_BUFFER, uboMatrices)
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, viewMat4)
      gl.bufferSubData(gl.UNIFORM_BUFFER, 64, projectionMat4)
      gl.bindBuffer(gl.UNIFORM_BUFFER, null)

      gl.bindBuffer(gl.UNIFORM_BUFFER, uboIsland)
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, new Int32Array([512]))
      gl.bufferSubData(gl.UNIFORM_BUFFER, 4, new Float32Array([16.0]))
      gl.bufferSubData(gl.UNIFORM_BUFFER, 8, new Float32Array([4.0]))
      gl.bindBuffer(gl.UNIFORM_BUFFER, null)

      gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight)
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.enable(gl.CULL_FACE)
      gl.cullFace(gl.BACK)

      gl.enable(gl.DEPTH_TEST)

      island.draw(gl)

      gl.useProgram(centerSPI.program)
      gl.uniformMatrix4fv(centerSPI.uLocation![0], false, centerMat4)
      gl.bindVertexArray(centerVAO)
      // gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0)
      gl.bindVertexArray(null)

      gl.useProgram(centerLineSPI.program)
      gl.uniformMatrix4fv(centerLineSPI.uLocation![0], false, centerMat4)
      gl.bindVertexArray(centerVAO)
      // gl.drawElements(gl.LINE_STRIP, 24, gl.UNSIGNED_SHORT, 0)
      gl.bindVertexArray(null)

      gl.useProgram(grassSPI.program)
      gl.uniformMatrix4fv(grassSPI.uLocation![0], false, invRotateYMat4)
      gl.uniform1f(grassSPI.uLocation![1], radius)
      gl.uniform3fv(grassSPI.uLocation![2], player.position)
      gl.uniform1i(grassSPI.uLocation![3], 1)
      gl.bindVertexArray(grassVAO)
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, grassPointsCount, grassCount)
      gl.bindVertexArray(null)

      gl.useProgram(groundSPI.program)
      gl.uniform3fv(groundSPI.uLocation![0], player.position)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeSky.texture)
      gl.uniform1i(groundSPI.uLocation![1], 0)
      gl.bindVertexArray(groundVAO)
      gl.drawArrays(gl.TRIANGLES, 0, 36)
      gl.bindVertexArray(null)

      // this.raf = requestAnimationFrame(render)
    }

    const ctrl = new Ctrl(canvas, player)
    ctrl.start()
    this.raf = requestAnimationFrame(render)
    this.render = () => {
      requestAnimationFrame(render)
    }
  }

  private beforeDestroy(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
  }
}
</script>

<style lang="stylus" scoped>
.screen
  overflow hidden
.status
  position fixed
  width 110px
  left 20px
  top 114px
  background #00000080
  padding 10px
  border-radius 4px
  border solid 1px #000000A0
  color #fff
  p
    font-size 14px
    margin 0.4em
    text-align left
  .sub
    margin 0 0.8em
    font-size 12px
</style>
