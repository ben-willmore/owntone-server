<template>
  <a v-on:click="play_previous">
    <span class="icon" v-bind:style="{ color: icon_color }"><i class="mdi mdi-skip-backward"></i></span>
  </a>
</template>

<script>
import webapi from '@/webapi'

export default {
  name: 'PlayerButtonPrevious',

  computed: {
    can_skip () {
      return (this.$store.state.queue.count > 0)
    },
    icon_color () {
      return this.can_skip ? 'black' : 'lightgray'
    }
  },

  methods: {
    play_previous: function () {
      if (this.can_skip) {
        webapi.player_previous()
      }
    }
  }
}
</script>

<style>
</style>
