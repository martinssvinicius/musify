<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Song;
use Illuminate\Http\Request;

class SongController extends Controller
{
    public function index()
    {
        return response()->json(
            Song::with('artist', 'album')->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'artist_id'    => 'required|exists:artists,id',
            'album_id'     => 'nullable|exists:albums,id',
            'track_number' => 'nullable|integer',
            'file'         => 'required|file|mimes:mp3,wav,flac|max:51200',
        ]);

        $data['file_path'] = $request->file('file')->store('songs', 'local');
        $data['duration']  = 0; // instale james-heinrich/getid3 para extrair duração real
        unset($data['file']);

        return response()->json(
            Song::create($data)->load('artist', 'album'), 201
        );
    }

    public function show(Song $song)
    {
        return response()->json($song->load('artist', 'album'));
    }

    public function update(Request $request, Song $song)
    {
        $data = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'artist_id'    => 'sometimes|exists:artists,id',
            'album_id'     => 'nullable|exists:albums,id',
            'track_number' => 'nullable|integer',
        ]);

        $song->update($data);
        return response()->json($song);
    }

    public function destroy(Song $song)
    {
        \Storage::disk('local')->delete($song->file_path);
        $song->delete();
        return response()->json(null, 204);
    }
}
