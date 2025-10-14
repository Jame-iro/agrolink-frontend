import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useAuth } from "../hooks/useAuth";
import { setRole } from "../store/slices/userSlice";
import {
  fetchUserOrders,
  updateOrderStatus,
} from "../store/slices/ordersSlice";
import { fetchProducts } from "../store/slices/productsSlice";
import Logo from "../components/Logo";
import {
  FiPackage,
  FiShoppingBag,
  FiUser,
  FiDollarSign,
  FiTrendingUp,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiBarChart2,
} from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user, role } = useAuth();
  const { items: orders, loading: ordersLoading } = useAppSelector(
    (state) => state.orders
  );
  const { items: products } = useAppSelector((state) => state.products);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders({ userId: user.id, role }));

      if (role === "farmer") {
        dispatch(fetchProducts({ farmerTelegramId: user.id }));
      }
    }
  }, [dispatch, user, role]);

  const switchRole = (newRole) => {
    dispatch(setRole(newRole));
  };

  // Stats for overview
  const getStats = () => {
    if (role === "consumer") {
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(
        (order) => order.status === "pending"
      ).length;
      const totalSpent = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      return [
        { label: "Total Orders", value: totalOrders, icon: FiPackage },
        { label: "Pending Orders", value: pendingOrders, icon: FiClock },
        {
          label: "Total Spent",
          value: `$${totalSpent.toFixed(2)}`,
          icon: FiDollarSign,
        },
      ];
    } else {
      const totalProducts = products.length;
      const activeProducts = products.filter((p) => p.isAvailable).length;
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(
        (order) => order.status === "pending"
      ).length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      return [
        { label: "Total Products", value: totalProducts, icon: FiShoppingBag },
        { label: "Active Products", value: activeProducts, icon: FiTrendingUp },
        { label: "Total Orders", value: totalOrders, icon: FiPackage },
        { label: "Pending Orders", value: pendingOrders, icon: FiClock },
        {
          label: "Total Revenue",
          value: `$${totalRevenue.toFixed(2)}`,
          icon: FiDollarSign,
        },
      ];
    }
  };

  const stats = getStats();

  const navItems = [
    { id: "overview", label: "Overview", icon: FiBarChart2 },
    { id: "orders", label: "Orders", icon: FiPackage },
    { id: "products", label: "Products", icon: FiShoppingBag },
    { id: "profile", label: "Profile", icon: FiUser },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.first_name}!</p>
            </div>
          </div>

          {/* Role Switch */}
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => switchRole("consumer")}
              className={`px-4 py-2 rounded-md transition-colors ${
                role === "consumer"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Consumer
            </button>
            <button
              onClick={() => switchRole("farmer")}
              className={`px-4 py-2 rounded-md transition-colors ${
                role === "farmer"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Farmer
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeTab === item.id
                        ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md p-6"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <IconComponent className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div className="flex items-center space-x-3">
                          <FiPackage className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-semibold">
                              Order #{order._id.slice(-6)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.totalAmount}</p>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">
                  {role === "consumer" ? "My Orders" : "Customer Orders"}
                </h2>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {orders.map((order) => (
                    <OrderCard key={order._id} order={order} role={role} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products Tab (Farmer only) */}
          {activeTab === "products" && (
            <div>
              {role === "farmer" ? (
                <FarmerProducts products={products} />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">
                    Products management is only available for farmers
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-lg">{user?.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <p className="mt-1 text-lg">@{user?.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <p className="mt-1 text-lg capitalize">{role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Order Status Badge Component
const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: FiClock };
      case "confirmed":
        return { color: "bg-blue-100 text-blue-800", icon: FiCheckCircle };
      case "shipped":
        return { color: "bg-purple-100 text-purple-800", icon: FiTruck };
      case "delivered":
        return { color: "bg-green-100 text-green-800", icon: FiBox };
      case "cancelled":
        return { color: "bg-red-100 text-red-800", icon: FiClock };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: FiClock };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <span
      className={`text-xs px-2 py-1 rounded flex items-center space-x-1 ${config.color}`}
    >
      <IconComponent className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
};

// Order Card Component
const OrderCard = ({ order, role }) => {
  const dispatch = useAppDispatch();

  const handleStatusUpdate = (newStatus) => {
    dispatch(updateOrderStatus({ orderId: order._id, status: newStatus }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
          <p className="text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleDateString()} •
            {role === "consumer"
              ? ` Farmer: ${order.farmerId?.firstName}`
              : ` Customer: ${order.consumerId?.firstName}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            ${order.totalAmount}
          </p>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Actions for Farmers */}
      {role === "farmer" && order.status === "pending" && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate("confirmed")}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center space-x-1"
          >
            <FiCheckCircle className="w-3 h-3" />
            <span>Confirm</span>
          </button>
          <button
            onClick={() => handleStatusUpdate("cancelled")}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center space-x-1"
          >
            <FiClock className="w-3 h-3" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Actions for confirmed orders */}
      {role === "farmer" && order.status === "confirmed" && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate("shipped")}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center space-x-1"
          >
            <FiTruck className="w-3 h-3" />
            <span>Mark as Shipped</span>
          </button>
        </div>
      )}

      {/* Actions for shipped orders */}
      {role === "farmer" && order.status === "shipped" && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate("delivered")}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center space-x-1"
          >
            <FiBox className="w-3 h-3" />
            <span>Mark as Delivered</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Farmer Products Component
const FarmerProducts = ({ products }) => {
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">My Products</h2>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <FiShoppingBag className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            You haven't added any products yet
          </p>
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 mx-auto"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>Add Your First Product</span>
          </button>
        </div>
      ) : (
        <div className="divide-y">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-6 flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.images?.[0] || "/placeholder-image.jpg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-green-600 font-bold">${product.price}</p>
                  <p className="text-sm text-gray-600">
                    Stock: {product.stock} • {product.category}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  product.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.isAvailable ? "Available" : "Out of Stock"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
