<template>
  <a v-on:click="toggle_play_pause">
    <span class="icon"><i class="mdi" v-bind:class="[icon_style, { 'mdi-music-off': !is_playing && !is_play_allowed, 'mdi-play': !is_playing && is_play_allowed, 'mdi-pause': is_playing && is_pause_allowed, 'mdi-stop': is_playing && !is_pause_allowed }]"></i></span>
  </a>
</template>

<script>
import webapi from '@/webapi'

export default {
  name: 'PlayerButtonPlayPause',

  props: ['icon_style'],

  computed: {
    is_playing () {
      return this.$store.state.player.state === 'play'
    },

    is_pause_allowed () {
      return (this.$store.getters.now_playing &&
        this.$store.getters.now_playing.data_kind !== 'pipe')
    },

    is_play_allowed () {
      return (this.$store.state.queue.count > 0)
    }
  },

  methods: {
    toggle_play_pause: function () {
      if (this.is_playing && this.is_pause_allowed) {
        webapi.player_pause()
      } else if (this.is_playing && !this.is_pause_allowed) {
        webapi.player_stop()
      } else if (this.is_play_allowed) {
        webapi.player_play()
      }
    }
  }
}
</script>

<style>
</style>
