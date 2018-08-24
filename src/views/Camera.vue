<template>
  <div @click="refresh">
    <div class="image" :class="{ 'clearly': !blur }"></div>
    <svg width="100%" height="100%">
      <defs>
        <mask id="camera-mask">
        <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
          <circle cx="50%" cy="50%" r="300" fill="#666" />
          <circle cx="50%" cy="50%" r="280" fill="#000" />
        </mask>
        <mask id="blades-mask">
          <path class="blades-mask"
            :style="{ 'transform': `rotate(${angle}deg)` }"
            d="M 0 0
              A 378.9 378.9 0 0 1 -317.2 508.8
              A 600 600 0 0 1 317.2 -508.8
              A 378.9 378.9 0 0 0 0 0"
            fill="#fff" />
        </mask>
        <mask id="i-blades-mask">
          <rect x="-50%" y="-50%" width="100%" height="100%" fill="#fff" />
          <path class="blades-mask"
            :style="{ 'transform': `rotate(${angle}deg)` }"
            d="M -1 0
              A 378.9 378.9 0 0 1 -317.2 508.8
              A 600 600 0 0 1 317.2 -508.8
              A 378.9 378.9 0 0 0 0 0"
            fill="#000" />
        </mask>
      </defs>
      <g>
        <g v-for="i in 4" :key="i" style="transform: translate3d(50%, 50%, 0);" mask="url(#i-blades-mask)">
          <g :style="{
            'transform': `rotate(${(-4 - i) * 40}deg)`
          }">
            <path class="blade"
              :style="{
                'transform': `translate3d(-23.048px, -123.705px, 0) rotate(${angle}deg)`
              }"
              d="M23.08,123.521C10.122,88.521 2.671,52.817 0.289,17.363C-0.166,10.876 3.352,4.759 9.188,1.89C15.025,-0.978 22.017,-0.027 26.875,4.296C45.716,20.917 66.532,35.847 89.188,48.782L91.317,49.993C184.586,103.244 246.676,190.296 270.912,287.011C271.603,289.797 271.062,292.746 269.429,295.106C213.822,374.873 121.63,423.881 22.866,423.733C19.493,423.703 16.363,421.969 14.547,419.125C12.732,416.282 12.477,412.713 13.87,409.64L14.12,409.076C41.833,365.64 57.897,314.065 57.897,258.767C57.897,209.732 45.265,163.623 23.08,123.521Z" style="fill:#666;stroke:#333;" />
          </g>
        </g>
      </g>
      <g>
        <g v-for="i in 9" :key="i" style="transform: translate3d(50%, 50%, 0);" :style="{
            'mask': i > 5 ? 'url(#blades-mask)' : ''
          }">
          <g :style="{
            'transform': `rotate(${(1 - i) * 40}deg)`
          }">
            <path class="blade"
              :style="{
                'transform': `translate3d(-23.048px, -123.705px, 0) rotate(${angle}deg)`
              }"
              d="M23.08,123.521C10.122,88.521 2.671,52.817 0.289,17.363C-0.166,10.876 3.352,4.759 9.188,1.89C15.025,-0.978 22.017,-0.027 26.875,4.296C45.716,20.917 66.532,35.847 89.188,48.782L91.317,49.993C184.586,103.244 246.676,190.296 270.912,287.011C271.603,289.797 271.062,292.746 269.429,295.106C213.822,374.873 121.63,423.881 22.866,423.733C19.493,423.703 16.363,421.969 14.547,419.125C12.732,416.282 12.477,412.713 13.87,409.64L14.12,409.076C41.833,365.64 57.897,314.065 57.897,258.767C57.897,209.732 45.265,163.623 23.08,123.521Z" style="fill:#666;stroke:#333;" />
          </g>
        </g>
      </g>
      <rect x="0" y="0" width="100%" height="100%" fill="#fff" mask="url(#camera-mask)" />
      <!-- <rect x="0" y="0" width="100%" height="100%" fill="#666" /> -->
      <!-- <g style="transform: translate3d(50%, 50%, 0);">
        <circle cx="-251.1" cy="145" r="290" fill="#00f5" />
        <circle cx="251.1" cy="-145" r="290" fill="#00f5" />
        <path transform-origin="0 290px 0"
          :style="{ 'transform': `rotate(${angle}deg)` }"
          d="M 0 0
            A 378.9 378.9 0 0 1 -317.2 508.8
            A 600 600 0 0 1 317.2 -508.8
            A 378.9 378.9 0 0 0 0 0"
          fill="#0f02" />
      </g> -->
    </svg>
    <!-- <input type="range" min="0" max="58" v-model="angle"> -->
    <!-- <div id="refresh" @click="refresh">Refresh</div> -->
  </div>
</template>

<script lang="ts">
import { Component , Vue, Provide } from 'vue-property-decorator'
import { setTimeout } from 'timers'

@Component
export default class Camera extends Vue {
  @Provide () private title: string = 'Camera'
  @Provide () private angle: number = 58
  @Provide () private blur: boolean = false

  private refresh(): void {
    this.angle = 0
    this.blur = true
    setTimeout(() => {
      this.angle = 58
      this.blur = false
    }, 1000)
  }
}
</script>

<style lang="stylus" scoped>
.image
  position fixed
  top 50%
  left 50%
  transform translate3d(-50%, -50%, 0)
  width 580px
  height 580px
  border-radius 290px
  background-image url('../assets/test.jpg')
  background-size cover
  background-position center
  transition filter .4s
  z-index -2
  filter blur(4px)
.clearly
  filter blur(0.001px)
  transition-delay .3s
svg
  position fixed
  top 0
  left 0
  z-index -1
.blades-mask
  transform-origin 0 290px 0
  transition transform .5s
.blade
  transform-origin 23.048px 412.717px 0
  transition transform .5s
</style>
