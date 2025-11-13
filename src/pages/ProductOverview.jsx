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
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ProductOverview = ({}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isTelegram } = useAuth();
  const { currentProduct, loading, error } = useAppSelector(
    (state) => state.products
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    return () => {
      dispatch(clearCurrentProduct());
      if (isTelegram) {
        telegramService.hideMainButton();
      }
    };
  }, [dispatch, id, isTelegram]);

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

  const nextImage = () => {
    if (currentProduct?.images?.length) {
      setSelectedImageIndex((prev) =>
        prev === currentProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (currentProduct?.images?.length) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? currentProduct.images.length - 1 : prev - 1
      );
    }
  };

  const getFarmerName = () => {
    if (currentProduct?.farmerName) {
      return currentProduct.farmerName;
    } else if (currentProduct?.farmerId?.firstName) {
      return currentProduct.farmerId.firstName;
    }
    return "Unknown Farmer";
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

  const hasMultipleImages =
    currentProduct.images && currentProduct.images.length > 1;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-green-600 hover:text-green-700 flex items-center gap-2"
      >
        <FiChevronLeft className="w-5 h-5" />
        Back to Store
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  currentProduct.images?.[selectedImageIndex] ||
                  "/placeholder-image.jpg"
                }
                alt={currentProduct.name}
                className="w-full h-80 lg:h-96 object-cover"
              />

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {currentProduct.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "border-green-500 ring-2 ring-green-200"
                        : "border-gray-300 hover:border-green-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {currentProduct.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            {/* Price and Stock */}
            <div className="flex items-center justify-between py-4 border-y">
              <div>
                <span className="text-2xl font-bold text-green-600">
                  ${currentProduct.price}
                </span>
                <span className="text-gray-500 text-sm ml-2">per item</span>
              </div>
              <div
                className={`text-lg font-semibold ${
                  currentProduct.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {currentProduct.stock > 0
                  ? `${currentProduct.stock} in stock`
                  : "Out of stock"}
              </div>
            </div>

            {/* Product Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Category:</span>
                <span className="font-semibold capitalize">
                  {currentProduct.category}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Location:</span>
                <span className="font-semibold">
                  {currentProduct.location || "Not specified"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block mb-1">Sold by:</span>
                <span className="font-semibold text-lg">{getFarmerName()}</span>
                {currentProduct.farmerUsername && (
                  <span className="text-gray-600 ml-2">
                    @{currentProduct.farmerUsername}
                  </span>
                )}
              </div>
            </div>

            {/* Tags */}
            {currentProduct.tags && currentProduct.tags.length > 0 && (
              <div>
                <span className="text-gray-500 block mb-2">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            {currentProduct.isAvailable ? (
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <span className="text-lg">-</span>
                    </button>
                    <span className="w-12 text-center text-xl font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          Math.min(currentProduct.stock, prev + 1)
                        )
                      }
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${(currentProduct.price * quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="border-t pt-6 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 font-semibold text-lg">
                    This product is currently out of stock
                  </p>
                  <p className="text-red-500 mt-1">
                    Check back later or browse similar products
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
