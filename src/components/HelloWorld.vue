<template>
  <div class="hello">
    <h3>Hello Flowers</h3>
    <p>...</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string
}
</script>

<style scoped lang="stylus">
h3
  margin 40px 0 0
</style>
