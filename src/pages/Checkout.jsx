import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useAuth } from "../hooks/useAuth";
import { clearCart } from "../store/slices/cartSlice";
import { createOrder } from "../store/slices/ordersSlice";
import {
  FiShoppingCart,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiCheck,
} from "react-icons/fi";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { items, total } = useAppSelector((state) => state.cart);
  const { loading: orderLoading } = useAppSelector((state) => state.orders);

  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.first_name || "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create order data
      const orderData = {
        consumerId: user?.telegramId || user?.id,
        items: items.map((item) => ({
          productId: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images?.[0],
        })),
        totalAmount: total,
        deliveryAddress: `${formData.address}, ${formData.city}`,
        customerPhone: formData.phone,
        customerNotes: formData.notes,
        paymentMethod: paymentMethod,
      };

      console.log("Creating order:", orderData);

      const result = await dispatch(createOrder(orderData)).unwrap();

      if (result) {
        // Clear cart and show success
        dispatch(clearCart());
        setActiveStep(4); // Success step
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const steps = [
    { number: 1, title: "Delivery Info", icon: FiUser },
    { number: 2, title: "Payment", icon: FiCreditCard },
    { number: 3, title: "Review", icon: FiCheck },
    { number: 4, title: "Complete", icon: FiCheck },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = activeStep > step.number;
            const isActive = activeStep === step.number;

            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isActive
                        ? "border-green-500 bg-white text-green-500"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <FiCheck className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 ${
                      isActive || isCompleted
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 ${
                      activeStep > step.number ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {activeStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-green-600" />
                Delivery Information
              </h2>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Street address, building, apartment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Any special delivery instructions..."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {activeStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FiCreditCard className="w-5 h-5 mr-2 text-green-600" />
                Payment Method
              </h2>

              <div className="space-y-4">
                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 cursor-pointer">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="font-semibold">Cash on Delivery</span>
                      <p className="text-sm text-gray-600">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 cursor-pointer">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="font-semibold">Credit/Debit Card</span>
                      <p className="text-sm text-gray-600">
                        Pay securely with your card
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FiCheck className="w-5 h-5 mr-2 text-green-600" />
                Review Your Order
              </h2>

              <div className="space-y-6">
                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              item.product.images?.[0] ||
                              "/placeholder-image.jpg"
                            }
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h3 className="font-semibold mb-3">Delivery Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p>
                      <strong>Name:</strong> {formData.fullName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {formData.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {formData.address},{" "}
                      {formData.city}
                    </p>
                    {formData.notes && (
                      <p>
                        <strong>Notes:</strong> {formData.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p>
                      <strong>Method:</strong>{" "}
                      {paymentMethod === "cash"
                        ? "Cash on Delivery"
                        : "Credit/Debit Card"}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={orderLoading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                  >
                    {orderLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your order. We'll notify you when it's on the way.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  View Orders
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-green-600">
                  ${(total + 2).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
