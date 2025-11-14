import React from "react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total } = useAppSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <Link
            to="/"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = 2.0;
  const finalTotal = total + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="bg-white light:bg-gray-800 rounded-lg shadow-md p-4 mb-4"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={item.product.images?.[0] || "/placeholder-image.jpg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  {/* Product name with truncation */}
                  <h3 className="font-semibold text-gray-900 light:text-white truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-green-600 light:text-green-400 font-bold">
                    ${item.product.price}
                  </p>

                  {/* Mobile: Stack quantity controls and remove button */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product._id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          )
                        }
                        className="w-8 h-8 rounded bg-gray-200 light:bg-gray-700 flex items-center justify-center hover:bg-gray-300 light:hover:bg-gray-600 transition-colors"
                      >
                        <span className="text-lg">-</span>
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product._id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="w-8 h-8 rounded bg-gray-200 light:bg-gray-700 flex items-center justify-center hover:bg-gray-300 light:hover:bg-gray-600 transition-colors"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.product._id))}
                      className="text-red-500 hover:text-red-700 light:hover:text-red-400 text-sm px-2 py-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white light:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 light:text-white">
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700 light:text-gray-300">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 light:text-gray-300">
                <span>Delivery Fee:</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 light:border-gray-600 pt-2">
                <span className="text-gray-900 light:text-white">Total:</span>
                <span className="text-green-600 light:text-green-400">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 mb-3 font-semibold transition-colors"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => dispatch(clearCart())}
              className="w-full bg-gray-200 light:bg-gray-700 text-gray-700 light:text-gray-300 py-2 rounded-lg hover:bg-gray-300 light:hover:bg-gray-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
