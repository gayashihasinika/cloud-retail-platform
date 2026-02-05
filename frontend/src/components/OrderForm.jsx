import { useState } from 'react';
import { placeOrder } from '../api/orders';
import { notify } from '../api/notifications';

export default function OrderForm({ product }) {
  const [quantity, setQuantity] = useState(1);

  const handleOrder = async () => {
    try {
      // Call Order Service
      const order = await placeOrder({
        product_id: product.id,
        customer_id: 2, // example
        quantity
      });

      // Call Notification Service
      await notify({
        type: 'order_created',
        data: {
          order_id: order.id,
          product_id: product.id,
          quantity
        }
      });

      alert('Order placed and notification sent!');
    } catch (err) {
      alert('Failed to place order');
    }
  };

  return (
    <div>
      <input type="number" value={quantity} min={1} onChange={e => setQuantity(e.target.value)} />
      <button onClick={handleOrder}>Order</button>
    </div>
  );
}
