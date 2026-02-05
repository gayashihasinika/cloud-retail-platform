<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OrderItem;;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'total_amount',
        'shipping_address',
    ];

    protected $casts = [
        'shipping_address' => 'array',
    ];

    
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function orderItems()
{
    return $this->hasMany(OrderItem::class, 'order_id', 'id');
}
}
