import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { setUser, setRole } from "../store/slices/userSlice";
import { telegramService } from "../services/telegram";
import { authAPI } from "../services/api";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { currentUser, role, loading } = useAppSelector((state) => state.user);
  const [isTelegram, setIsTelegram] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Initialize Telegram
      const isTg = telegramService.init();
      setIsTelegram(isTg);

      if (isTg) {
        // Real Telegram environment
        const telegramUser = telegramService.getUser();
        const initData = telegramService.getInitData();

        if (telegramUser && initData) {
          try {
            // Validate with backend
            const response = await authAPI.validateTelegram(initData);
            if (response.data.success) {
              dispatch(setUser(response.data.user));
              dispatch(setRole(response.data.user.role));
            }
          } catch (error) {
            console.error("Telegram auth failed:", error);
            // Fallback to Telegram user data
            const userData = {
              id: telegramUser.id,
              first_name: telegramUser.first_name,
              username: telegramUser.username,
            };
            dispatch(setUser(userData));
          }
        }
      } else {
        // Development mode - outside Telegram
        console.log("Running outside Telegram");
        const mockUser = {
          id: 123456789,
          first_name: "Test User",
          username: "testuser",
        };
        dispatch(setUser(mockUser));
      }

      setAuthLoading(false);
    };

    if (!currentUser) {
      initializeApp();
    } else {
      setAuthLoading(false);
    }
  }, [dispatch, currentUser]);

  return {
    user: currentUser,
    role,
    loading: authLoading,
    isAuthenticated: !!currentUser,
    isTelegram,
  };
};
