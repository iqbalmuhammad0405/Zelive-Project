<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('live_rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('store_id');
            $table->string('title');
            $table->enum('status', ['LIVE', 'ENDED', 'PAUSED'])->default('LIVE');
            $table->integer('viewer_count')->default(0);
            $table->integer('total_likes')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();

            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('live_rooms');
    }
};
