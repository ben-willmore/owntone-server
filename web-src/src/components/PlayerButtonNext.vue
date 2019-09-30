<template>
  <a v-on:click="play_next">
    <span class="icon" v-bind:style="{ color: icon_color }"><i class="mdi mdi-skip-forward"></i></span>
  </a>
</template>

<script>
import webapi from '@/webapi'

export default {
  name: 'PlayerButtonNext',

  computed: {
    can_skip () {
      return (this.$store.state.queue.count > 0)
    },
    icon_color () {
      return this.can_skip ? 'black' : 'lightgray'
    }
  },

  methods: {
    play_next: function () {
      if (this.can_skip) {
        webapi.player_next()
      }
    }
  }
}
</script>

<style>
</style>
