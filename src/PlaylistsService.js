const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const playlistQuery = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);
    // if (!playlistResult.rowCount) {
    //   throw new NotFoundError('Playlist not found');
    // }

    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlists 
        JOIN playlist_songs ON  playlist_songs.playlist_id = playlists.id
        JOIN songs ON songs.id = playlist_songs.song_id
        WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    playlist.songs = songsResult.rows;

    return playlist;
  }

}

module.exports = PlaylistsService;