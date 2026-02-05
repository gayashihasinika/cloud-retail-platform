<?php

// services/product-service/app/Http/Controllers/ProductController.php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    

    // GET /api/products
    public function index()
{
    return Product::where('is_active', 1)->get();
}


    // POST /api/products
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    // PUT /api/products/{id}
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());

        return response()->json($product);
    }

    // DELETE /api/products/{id}
    public function destroy($id)
{
    $product = Product::findOrFail($id);
    $product->update(['is_active' => 0]);

    return response()->json([
        'message' => 'Product disabled successfully'
    ]);
}


    public function show($id)
{
    $product = Product::findOrFail($id);
    return response()->json($product, 200);
}

    public function updateStock(Request $request, $id)
{
    $request->validate([
        'quantity'  => 'required|integer|min:1',
        'operation' => 'required|in:decrease,increase',
    ]);

    $product = Product::lockForUpdate()->findOrFail($id);

    if ($request->operation === 'decrease') {
        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Insufficient stock'], 400);
        }
        $product->stock -= $request->quantity;
    } else {
        $product->stock += $request->quantity;
    }

    $product->save();

    return response()->json(['message' => 'Stock updated', 'stock' => $product->stock]);
}

public function count()
{
    return response()->json([
        'count' => \App\Models\Product::count()
    ]);
}

}
