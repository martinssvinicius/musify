<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('albums', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->foreignId('artist_id')->constrained()->cascadeOnDelete();
        $table->string('cover')->nullable();
        $table->year('year')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};
