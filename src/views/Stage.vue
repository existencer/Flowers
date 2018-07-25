<template>
  <div>
    <h1>Stage</h1>
    <screen></screen>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Screen from '@/components/Screen.vue'

@Component({
  data() {
    return {
      title: 'State'
    }
  },
  components: {
    Screen
  }
})
export default class Stage extends Vue {}
</script>

