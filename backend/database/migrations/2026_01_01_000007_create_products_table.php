<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('store_id');
            $table->foreignId('category_id')->nullable()->constrained('product_categories')->onDelete('set null');
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 15, 2);
            $table->decimal('discount', 5, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->decimal('weight', 8, 2)->default(0)->comment('Weight in grams');
            $table->enum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'OUT_OF_STOCK'])->default('DRAFT');
            $table->timestamps();

            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('products');
    }
};
