<template>
  <div class="hello">
    <h3>{{msg}}</h3>
    <div class="version">α</div>
    <p>Developed by <a target="_blank" href="https://github.com/existencer">Felix</a></p>
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
.version
  margin 20px 0 0
p
  margin 20px 0 0
  font-size 14px
a
  color #2c3e50
</style>
