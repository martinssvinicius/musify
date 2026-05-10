<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Song;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StreamController extends Controller
{
    public function stream(Song $song, Request $request): StreamedResponse
    {
        $path = storage_path('app/private/' . $song->file_path);

        abort_unless(file_exists($path), 404);

        $size    = filesize($path);
        $start   = 0;
        $end     = $size - 1;
        $status  = 200;
        $headers = [
            'Content-Type'        => 'audio/mpeg',
            'Accept-Ranges'       => 'bytes',
            'Content-Disposition' => 'inline',
            'Cache-Control'       => 'no-cache',
        ];

        if ($request->hasHeader('Range')) {
            preg_match('/bytes=(\d+)-(\d*)/', $request->header('Range'), $m);
            $start  = (int) $m[1];
            $end    = isset($m[2]) && $m[2] !== '' ? (int) $m[2] : $size - 1;
            $status = 206;
            $headers['Content-Range'] = "bytes {$start}-{$end}/{$size}";
        }

        $headers['Content-Length'] = $end - $start + 1;

        return response()->stream(function () use ($path, $start, $end) {
            $fp        = fopen($path, 'rb');
            $remaining = $end - $start + 1;
            fseek($fp, $start);
            while (!feof($fp) && $remaining > 0) {
                echo fread($fp, min(8192, $remaining));
                $remaining -= 8192;
                flush();
            }
            fclose($fp);
        }, $status, $headers);
    }
}