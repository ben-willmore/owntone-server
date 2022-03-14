<template>
  <div>
    <content-with-heading>
      <template #heading-left>
        <p class="title is-4">Files</p>
        <p class="title is-7 has-text-grey">
          {{ current_directory }}
        </p>
      </template>
      <template #heading-right>
        <div class="buttons is-centered">
          <a
            class="button is-small is-light is-rounded"
            @click="open_directory_dialog({ path: current_directory })"
          >
            <span class="icon"
              ><i class="mdi mdi-dots-horizontal mdi-18px"
            /></span>
          </a>
          <a class="button is-small is-dark is-rounded" @click="play">
            <span class="icon"><i class="mdi mdi-play" /></span>
            <span>Play</span>
          </a>
        </div>
      </template>
      <template #content>
        <div
          v-if="$route.query.directory"
          class="media"
          @click="open_parent_directory()"
        >
          <figure class="media-left fd-has-action">
            <span class="icon">
              <i class="mdi mdi-subdirectory-arrow-left" />
            </span>
          </figure>
          <div class="media-content fd-has-action is-clipped">
            <h1 class="title is-6">..</h1>
          </div>
          <div class="media-right">
            <slot name="actions" />
          </div>
        </div>

        <list-item-directory
          v-for="directory in files.directories"
          :key="directory.path"
          :directory="directory"
          @click="open_directory(directory)"
        >
          <template #actions>
            <a @click="open_directory_dialog(directory)">
              <span class="icon has-text-dark"
                ><i class="mdi mdi-dots-vertical mdi-18px"
              /></span>
            </a>
          </template>
        </list-item-directory>

        <list-playlists :playlists="files.playlists.items" />

        <list-tracks
          :tracks="files.tracks.items"
          :expression="play_expression"
          :show_icon="true"
        />

        <modal-dialog-directory
          :show="show_directory_details_modal"
          :directory="selected_directory"
          @close="show_directory_details_modal = false"
        />
      </template>
    </content-with-heading>
  </div>
</template>

<script>
import ContentWithHeading from '@/templates/ContentWithHeading.vue'
import ListItemDirectory from '@/components/ListItemDirectory.vue'
import ListPlaylists from '@/components/ListPlaylists.vue'
import ListTracks from '@/components/ListTracks.vue'
import ModalDialogDirectory from '@/components/ModalDialogDirectory.vue'
import webapi from '@/webapi'

const dataObject = {
  load: function (to) {
    if (to.query.directory) {
      return webapi.library_files(to.query.directory)
    }
    return Promise.resolve()
  },

  set: function (vm, response) {
    if (response) {
      vm.files = response.data
    } else {
      vm.files = {
        directories: vm.$store.state.config.directories.map((dir) => {
          return { path: dir }
        }),
        tracks: { items: [] },
        playlists: { items: [] }
      }
    }
  }
}

export default {
  name: 'PageFiles',
  components: {
    ContentWithHeading,
    ListItemDirectory,
    ListPlaylists,
    ListTracks,
    ModalDialogDirectory
  },

  beforeRouteEnter(to, from, next) {
    dataObject.load(to).then((response) => {
      next((vm) => dataObject.set(vm, response))
    })
  },
  beforeRouteUpdate(to, from, next) {
    const vm = this
    dataObject.load(to).then((response) => {
      dataObject.set(vm, response)
      next()
    })
  },

  data() {
    return {
      files: {
        directories: [],
        tracks: { items: [] },
        playlists: { items: [] }
      },

      show_directory_details_modal: false,
      selected_directory: {}
    }
  },

  computed: {
    current_directory() {
      if (this.$route.query && this.$route.query.directory) {
        return this.$route.query.directory
      }
      return '/'
    },

    play_expression() {
      return (
        'path starts with "' + this.current_directory + '" order by path asc'
      )
    }
  },

  methods: {
    open_parent_directory: function () {
      const parent = this.current_directory.slice(
        0,
        this.current_directory.lastIndexOf('/')
      )
      if (
        parent === '' ||
        this.$store.state.config.directories.includes(this.current_directory)
      ) {
        this.$router.push({ path: '/files' })
      } else {
        this.$router.push({
          path: '/files',
          query: {
            directory: this.current_directory.slice(
              0,
              this.current_directory.lastIndexOf('/')
            )
          }
        })
      }
    },

    open_directory: function (directory) {
      this.$router.push({
        path: '/files',
        query: { directory: directory.path }
      })
    },

    open_directory_dialog: function (directory) {
      this.selected_directory = directory
      this.show_directory_details_modal = true
    },

    play: function () {
      webapi.player_play_expression(this.play_expression, false)
    }
  }
}
</script>

<style></style>
