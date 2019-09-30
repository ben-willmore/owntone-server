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
      const queueLen = this.$store.state.queue.count
      if (queueLen === 0) {
        return false
      }
      const nowPlaying = this.$store.getters.now_playing
      return nowPlaying === undefined || nowPlaying.position === undefined ? false : (this.$store.getters.now_playing.position < (queueLen - 1))
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
