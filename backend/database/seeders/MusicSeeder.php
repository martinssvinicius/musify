<?php

namespace Database\Seeders;

use App\Models\Artist;
use App\Models\Album;
use App\Models\Song;
use Illuminate\Database\Seeder;

class MusicSeeder extends Seeder
{
    public function run(): void
    {
        $artist = Artist::create([
            'name' => 'Arctic Monkeys',
            'bio'  => 'Banda de rock britânica formada em Sheffield.',
        ]);

        $album = Album::create([
            'title'     => 'AM',
            'artist_id' => $artist->id,
            'year'      => 2013,
        ]);

        $songs = [
            'Do I Wanna Know?',
            'R U Mine?',
            'One For the Road',
            'Arabella',
            'I Want It All',
        ];

        foreach ($songs as $i => $title) {
            Song::create([
                'title'        => $title,
                'artist_id'    => $artist->id,
                'album_id'     => $album->id,
                'file_path'    => 'placeholder.mp3',
                'duration'     => rand(180, 300),
                'track_number' => $i + 1,
            ]);
        }
    }
}