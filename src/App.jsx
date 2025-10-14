import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useTelegramTheme } from "./hooks/useTelegramTheme";
import Header from "./components/Header";
import Store from "./pages/Store";
import ProductOverview from "./pages/ProductOverview";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";

function App() {
  const { user, loading, isTelegram } = useAuth();
  const { isDark } = useTelegramTheme();

  useEffect(() => {
    // Apply Telegram theme if in Telegram
    if (isTelegram && isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isTelegram, isDark]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div
        className={`min-h-screen transition-colors ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Store />} />
            <Route path="/product/:id" element={<ProductOverview />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
