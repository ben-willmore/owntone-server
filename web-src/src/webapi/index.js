import axios from 'axios'
import store from '@/store'

const myAxios = axios.create({
  headers: { 'Cache-Control': 'no-store' }
})

myAxios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.request.status && error.request.responseURL) {
    store.dispatch('add_notification', { text: 'Request failed (status: ' + error.request.status + ' ' + error.request.statusText + ', url: ' + error.request.responseURL + ')', type: 'danger' })
  }
  return Promise.reject(error)
})

export default {
  config () {
    return myAxios.get('./api/config')
  },

  settings () {
    return myAxios.get('./api/settings')
  },

  settings_update (categoryName, option) {
    return myAxios.put('./api/settings/' + categoryName + '/' + option.name, option)
  },

  library_stats () {
    return myAxios.get('./api/library')
  },

  library_update (scanKind) {
    const params = {}
    if (scanKind) {
      params.scan_kind = scanKind
    }
    return myAxios.put('./api/update', undefined, { params: params })
  },

  library_rescan (scanKind) {
    const params = {}
    if (scanKind) {
      params.scan_kind = scanKind
    }
    return myAxios.put('./api/rescan', undefined, { params: params })
  },

  library_count (expression) {
    return myAxios.get('./api/library/count?expression=' + expression)
  },

  queue () {
    return myAxios.get('./api/queue')
  },

  queue_clear () {
    return myAxios.put('./api/queue/clear')
  },

  queue_remove (itemId) {
    return myAxios.delete('./api/queue/items/' + itemId)
  },

  queue_move (itemId, newPosition) {
    return myAxios.put('./api/queue/items/' + itemId + '?new_position=' + newPosition)
  },

  queue_add (uri) {
    return myAxios.post('./api/queue/items/add?uris=' + uri).then((response) => {
      store.dispatch('add_notification', { text: response.data.count + ' tracks appended to queue', type: 'info', timeout: 2000 })
      return Promise.resolve(response)
    })
  },

  queue_add_next (uri) {
    let position = 0
    if (store.getters.now_playing && store.getters.now_playing.id) {
      position = store.getters.now_playing.position + 1
    }
    return myAxios.post('./api/queue/items/add?uris=' + uri + '&position=' + position).then((response) => {
      store.dispatch('add_notification', { text: response.data.count + ' tracks appended to queue', type: 'info', timeout: 2000 })
      return Promise.resolve(response)
    })
  },

  queue_expression_add (expression) {
    const options = {}
    options.expression = expression

    return myAxios.post('./api/queue/items/add', undefined, { params: options }).then((response) => {
      store.dispatch('add_notification', { text: response.data.count + ' tracks appended to queue', type: 'info', timeout: 2000 })
      return Promise.resolve(response)
    })
  },

  queue_expression_add_next (expression) {
    const options = {}
    options.expression = expression
    options.position = 0
    if (store.getters.now_playing && store.getters.now_playing.id) {
      options.position = store.getters.now_playing.position + 1
    }

    return myAxios.post('./api/queue/items/add', undefined, { params: options }).then((response) => {
      store.dispatch('add_notification', { text: response.data.count + ' tracks appended to queue', type: 'info', timeout: 2000 })
      return Promise.resolve(response)
    })
  },

  queue_save_playlist (name) {
    return myAxios.post('./api/queue/save', undefined, { params: { name: name } }).then((response) => {
      store.dispatch('add_notification', { text: 'Queue saved to playlist "' + name + '"', type: 'info', timeout: 2000 })
      return Promise.resolve(response)
    })
  },

  player_status () {
    return myAxios.get('./api/player')
  },

  player_play_uri (uris, shuffle, position = undefined) {
    const options = {}
    options.uris = uris
    options.shuffle = shuffle ? 'true' : 'false'
    options.clear = 'true'
    options.playback = 'start'
    options.playback_from_position = position

    return myAxios.post('./api/queue/items/add', undefined, { params: options })
  },

  player_play_expression (expression, shuffle, position = undefined) {
    const options = {}
    options.expression = expression
    options.shuffle = shuffle ? 'true' : 'false'
    options.clear = 'true'
    options.playback = 'start'
    options.playback_from_position = position

    return myAxios.post('./api/queue/items/add', undefined, { params: options })
  },

  player_play (options = {}) {
    return myAxios.put('./api/player/play', undefined, { params: options })
  },

  player_playpos (position) {
    return myAxios.put('./api/player/play?position=' + position)
  },

  player_playid (itemId) {
    return myAxios.put('./api/player/play?item_id=' + itemId)
  },

  player_pause () {
    return myAxios.put('./api/player/pause')
  },

  player_stop () {
    return myAxios.put('./api/player/stop')
  },

  player_next () {
    return myAxios.put('./api/player/next')
  },

  player_previous () {
    return myAxios.put('./api/player/previous')
  },

  player_shuffle (newState) {
    const shuffle = newState ? 'true' : 'false'
    return myAxios.put('./api/player/shuffle?state=' + shuffle)
  },

  player_consume (newState) {
    const consume = newState ? 'true' : 'false'
    return myAxios.put('./api/player/consume?state=' + consume)
  },

  player_repeat (newRepeatMode) {
    return myAxios.put('./api/player/repeat?state=' + newRepeatMode)
  },

  player_volume (volume) {
    return myAxios.put('./api/player/volume?volume=' + volume)
  },

  player_output_volume (outputId, outputVolume) {
    return myAxios.put('./api/player/volume?volume=' + outputVolume + '&output_id=' + outputId)
  },

  player_seek_to_pos (newPosition) {
    return myAxios.put('./api/player/seek?position_ms=' + newPosition)
  },

  player_seek (seekMs) {
    return myAxios.put('./api/player/seek?seek_ms=' + seekMs)
  },

  outputs () {
    return myAxios.get('./api/outputs')
  },

  output_update (outputId, output) {
    return myAxios.put('./api/outputs/' + outputId, output)
  },

  output_toggle (outputId) {
    return myAxios.put('./api/outputs/' + outputId + '/toggle')
  },

  library_artists (media_kind = undefined) {
    return myAxios.get('./api/library/artists', { params: { media_kind: media_kind } })
  },

  library_artist (artistId) {
    return myAxios.get('./api/library/artists/' + artistId)
  },

  library_artist_albums (artistId) {
    return myAxios.get('./api/library/artists/' + artistId + '/albums')
  },

  library_albums (media_kind = undefined) {
    return myAxios.get('./api/library/albums', { params: { media_kind: media_kind } })
  },

  library_album (albumId) {
    return myAxios.get('./api/library/albums/' + albumId)
  },

  library_album_tracks (albumId, filter = { limit: -1, offset: 0 }) {
    return myAxios.get('./api/library/albums/' + albumId + '/tracks', {
      params: filter
    })
  },

  library_album_track_update (albumId, attributes) {
    return myAxios.put('./api/library/albums/' + albumId + '/tracks', undefined, { params: attributes })
  },

  library_genres () {
    return myAxios.get('./api/library/genres')
  },

  library_genre (genre) {
    const genreParams = {
      type: 'albums',
      media_kind: 'music',
      expression: 'genre is "' + genre + '"'
    }
    return myAxios.get('./api/search', {
      params: genreParams
    })
  },

  library_genre_tracks (genre) {
    const genreParams = {
      type: 'tracks',
      media_kind: 'music',
      expression: 'genre is "' + genre + '"'
    }
    return myAxios.get('./api/search', {
      params: genreParams
    })
  },

  library_radio_streams () {
    const params = {
      type: 'tracks',
      media_kind: 'music',
      expression: 'data_kind is url and song_length = 0'
    }
    return myAxios.get('./api/search', {
      params: params
    })
  },

  library_composers () {
    return myAxios.get('./api/library/composers')
  },

  library_composer (composer) {
    const params = {
      type: 'albums',
      media_kind: 'music',
      expression: 'composer is "' + composer + '"'
    }
    return myAxios.get('./api/search', {
      params: params
    })
  },

  library_composer_tracks (composer) {
    const params = {
      type: 'tracks',
      media_kind: 'music',
      expression: 'composer is "' + composer + '"'
    }
    return myAxios.get('./api/search', {
      params: params
    })
  },

  library_artist_tracks (artist) {
    if (artist) {
      const artistParams = {
        type: 'tracks',
        expression: 'songartistid is "' + artist + '"'
      }
      return myAxios.get('./api/search', {
        params: artistParams
      })
    }
  },

  library_podcasts_new_episodes () {
    const episodesParams = {
      type: 'tracks',
      expression: 'media_kind is podcast and play_count = 0 ORDER BY time_added DESC'
    }
    return myAxios.get('./api/search', {
      params: episodesParams
    })
  },

  library_podcast_episodes (albumId) {
    const episodesParams = {
      type: 'tracks',
      expression: 'media_kind is podcast and songalbumid is "' + albumId + '" ORDER BY date_released DESC'
    }
    return myAxios.get('./api/search', {
      params: episodesParams
    })
  },

  library_add (url) {
    return myAxios.post('./api/library/add', undefined, { params: { url: url } })
  },

  library_playlist_delete (playlistId) {
    return myAxios.delete('./api/library/playlists/' + playlistId, undefined)
  },

  library_playlists () {
    return myAxios.get('./api/library/playlists')
  },

  library_playlist_folder (playlistId = 0) {
    return myAxios.get('./api/library/playlists/' + playlistId + '/playlists')
  },

  library_playlist (playlistId) {
    return myAxios.get('./api/library/playlists/' + playlistId)
  },

  library_playlist_tracks (playlistId) {
    return myAxios.get('./api/library/playlists/' + playlistId + '/tracks')
  },

  library_track (trackId) {
    return myAxios.get('./api/library/tracks/' + trackId)
  },

  library_track_playlists (trackId) {
    return myAxios.get('./api/library/tracks/' + trackId + '/playlists')
  },

  library_track_update (trackId, attributes = {}) {
    return myAxios.put('./api/library/tracks/' + trackId, undefined, { params: attributes })
  },

  library_files (directory = undefined) {
    const filesParams = { directory: directory }
    return myAxios.get('./api/library/files', {
      params: filesParams
    })
  },

  search (searchParams) {
    return myAxios.get('./api/search', {
      params: searchParams
    })
  },

  spotify () {
    return myAxios.get('./api/spotify')
  },

  spotify_login (credentials) {
    return myAxios.post('./api/spotify-login', credentials)
  },

  spotify_logout () {
    return myAxios.get('./api/spotify-logout')
  },

  lastfm () {
    return myAxios.get('./api/lastfm')
  },

  lastfm_login (credentials) {
    return myAxios.post('./api/lastfm-login', credentials)
  },

  lastfm_logout (credentials) {
    return myAxios.get('./api/lastfm-logout')
  },

  pairing () {
    return myAxios.get('./api/pairing')
  },

  pairing_kickoff (pairingReq) {
    return myAxios.post('./api/pairing', pairingReq)
  },

  artwork_url_append_size_params (artworkUrl, maxwidth = 600, maxheight = 600) {
    if (artworkUrl && artworkUrl.startsWith('/')) {
      if (artworkUrl.includes('?')) {
        return artworkUrl + '&maxwidth=' + maxwidth + '&maxheight=' + maxheight
      }
      return artworkUrl + '?maxwidth=' + maxwidth + '&maxheight=' + maxheight
    }
    return artworkUrl
  }
}
