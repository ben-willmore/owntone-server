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
      if (this.$store.state.player.item_progress_ms > 3000) {
        return true
      }
      const queueLen = this.$store.state.queue.count
      if (queueLen === 0) {
        return false
      }
      const nowPlaying = this.$store.getters.now_playing
      return nowPlaying === undefined || nowPlaying.position === undefined ? false : (this.$store.getters.now_playing.position > 0)
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
