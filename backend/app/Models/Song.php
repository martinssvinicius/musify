<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    protected $fillable = ['title', 'artist_id', 'album_id', 'file_path', 'duration', 'track_number'];

    public function artist() { return $this->belongsTo(Artist::class); }
    public function album()  { return $this->belongsTo(Album::class); }
    public function playlists() { return $this->belongsToMany(Playlist::class)->withPivot('order'); }
}