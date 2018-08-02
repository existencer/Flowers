<template>
  <div class="home">
    <HelloWorld msg="WebGL2 / Vue.js / TypeScript project"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '@/components/HelloWorld.vue'

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {}
</script>
