<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ArtistController extends Controller
{
    public function index()
    {
        return response()->json(Artist::withCount('songs')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'bio'   => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('artists', 'public');
        }

        return response()->json(Artist::create($data), 201);
    }

    public function show(Artist $artist)
    {
        return response()->json($artist->load('albums', 'songs'));
    }

    public function update(Request $request, Artist $artist)
    {
        $data = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'bio'   => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('artists', 'public');
        }

        $artist->update($data);
        return response()->json($artist);
    }

    public function destroy(Artist $artist)
    {
        $artist->delete();
        return response()->json(null, 204);
    }
}
