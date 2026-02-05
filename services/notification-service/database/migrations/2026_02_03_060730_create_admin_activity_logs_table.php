<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('admin_activity_logs', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('admin_id');
        $table->string('admin_name');
        $table->string('action');
        $table->string('entity_type'); // product, order, customer
        $table->unsignedBigInteger('entity_id');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_activity_logs');
    }
};
