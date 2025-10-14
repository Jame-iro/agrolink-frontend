import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchProductById,
  clearCurrentProduct,
} from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import { useAuth } from "../hooks/useAuth";
import { telegramService } from "../services/telegram";

const ProductOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isTelegram } = useAuth();
  const { currentProduct, loading, error } = useAppSelector(
    (state) => state.products
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    return () => {
      dispatch(clearCurrentProduct());
      // Clean up Telegram main button
      if (isTelegram) {
        telegramService.hideMainButton();
      }
    };
  }, [dispatch, id, isTelegram]);

  // Setup Telegram main button for ordering
  useEffect(() => {
    if (isTelegram && currentProduct?.isAvailable) {
      const handleOrder = () => {
        if (currentProduct) {
          dispatch(addToCart({ product: currentProduct, quantity }));
          telegramService.hideMainButton();
          navigate("/cart");
        }
      };

      telegramService.showMainButton(
        `Add to Cart - $${(currentProduct.price * quantity).toFixed(2)}`,
        handleOrder
      );
    } else if (isTelegram) {
      telegramService.hideMainButton();
    }

    return () => {
      if (isTelegram) {
        telegramService.hideMainButton();
      }
    };
  }, [isTelegram, currentProduct, quantity, dispatch, navigate]);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({ product: currentProduct, quantity }));
      if (!isTelegram) {
        navigate("/cart");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-green-600 hover:text-green-700"
      >
        ← Back to Store
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={currentProduct.images?.[0] || "/placeholder-image.jpg"}
          alt={currentProduct.name}
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{currentProduct.name}</h1>
          <p className="text-gray-600 mb-4">{currentProduct.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-gray-500">Price:</span>
              <p className="text-2xl font-bold text-green-600">
                ${currentProduct.price}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Category:</span>
              <p className="font-semibold capitalize">
                {currentProduct.category}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Stock:</span>
              <p
                className={
                  currentProduct.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {currentProduct.stock} available
              </p>
            </div>
            <div>
              <span className="text-gray-500">Farmer:</span>
              <p className="font-semibold">
                {currentProduct.farmerId?.firstName}
              </p>
            </div>
          </div>

          {currentProduct.isAvailable ? (
            <div className="border-t pt-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-700">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(currentProduct.stock, prev + 1)
                      )
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Add to Cart - ${(currentProduct.price * quantity).toFixed(2)}
              </button>
            </div>
          ) : (
            <div className="text-red-500 text-center py-4 border-t">
              This product is currently out of stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
