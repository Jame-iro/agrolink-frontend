import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAppSelector } from "../hooks/redux";

const TelegramDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, isTelegram } = useAuth();
  const { items: allProducts } = useAppSelector((state) => state.products);
  const { items: orders } = useAppSelector((state) => state.orders);

  // Only show in Telegram environment
  if (!isTelegram) {
    return null;
  }

  // Filter products for current user
  const myProducts = allProducts.filter(
    (product) => product.farmerTelegramId === (user?.telegramId || user?.id)
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-red-600 text-sm"
        >
          Debug
        </button>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg border w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">Debug Info</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {/* User Info */}
            <div className="border-b pb-2">
              <h4 className="font-semibold text-gray-700">User Info</h4>
              <p>ID: {user?.id}</p>
              <p>Telegram ID: {user?.telegramId}</p>
              <p>Name: {user?.first_name}</p>
              <p>Role: {role}</p>
            </div>

            {/* Products Info */}
            <div className="border-b pb-2">
              <h4 className="font-semibold text-gray-700">Products Info</h4>
              <p>Total Products: {allProducts.length}</p>
              <p>My Products: {myProducts.length}</p>
              <p>My Telegram ID: {user?.telegramId || user?.id}</p>
            </div>

            {/* Orders Info */}
            <div className="border-b pb-2">
              <h4 className="font-semibold text-gray-700">Orders Info</h4>
              <p>Total Orders: {orders.length}</p>
            </div>

            {/* My Products List */}
            {myProducts.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700">My Products:</h4>
                <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                  {myProducts.map((product) => (
                    <div
                      key={product._id}
                      className="text-xs border-l-2 border-green-500 pl-2"
                    >
                      <div className="font-medium">{product.name}</div>
                      <div>ID: {product.farmerTelegramId}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Products Sample */}
            <div>
              <h4 className="font-semibold text-gray-700">
                All Products Sample:
              </h4>
              <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                {allProducts.slice(0, 3).map((product) => (
                  <div
                    key={product._id}
                    className="text-xs border-l-2 border-blue-500 pl-2"
                  >
                    <div className="font-medium">{product.name}</div>
                    <div>Farmer ID: {product.farmerTelegramId}</div>
                    <div>
                      Match:{" "}
                      {product.farmerTelegramId ===
                      (user?.telegramId || user?.id)
                        ? "YES"
                        : "NO"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramDebugPanel;
