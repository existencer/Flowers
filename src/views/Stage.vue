<template>
  <div>
    <h1>Stage</h1>
    <screen></screen>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import Screen from '@/components/Screen.vue'

@Component({
  components: {
    Screen
  }
})
export default class Stage extends Vue {
  @Provide() private title: string = 'State'
}
</script>

