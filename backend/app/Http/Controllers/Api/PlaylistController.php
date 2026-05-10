<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PlaylistController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->playlists()->withCount('songs')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'is_public' => 'boolean',
        ]);

        return response()->json(
            $request->user()->playlists()->create($data), 201
        );
    }

    public function show(Playlist $playlist)
    {
        $this->authorize('view', $playlist);
        return response()->json($playlist->load('songs.artist'));
    }

    public function update(Request $request, Playlist $playlist)
    {
        $this->authorize('update', $playlist);
        $playlist->update($request->validate([
            'name'      => 'sometimes|string|max:255',
            'is_public' => 'boolean',
        ]));
        return response()->json($playlist);
    }

    public function destroy(Playlist $playlist)
    {
        $this->authorize('delete', $playlist);
        $playlist->delete();
        return response()->json(null, 204);
    }

    public function addSong(Request $request, Playlist $playlist)
    {
        $this->authorize('update', $playlist);
        $request->validate(['song_id' => 'required|exists:songs,id']);

        $order = $playlist->songs()->count();
        $playlist->songs()->attach($request->song_id, ['order' => $order]);

        return response()->json($playlist->load('songs.artist'));
    }

    public function removeSong(Playlist $playlist, Song $song)
    {
        $this->authorize('update', $playlist);
        $playlist->songs()->detach($song->id);
        return response()->json(null, 204);
    }
}
