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
        const telegramUser = telegramService.getUser();
        const initData = telegramService.getInitData();

        if (telegramUser && initData) {
          try {
            const response = await authAPI.validateTelegram(initData);
            if (response.data.success) {
              dispatch(setUser(response.data.user));
              dispatch(setRole(response.data.user.role));
            }
          } catch (error) {
            console.error("Telegram auth failed:", error);

            const userData = {
              id: telegramUser.id,
              telegramId: telegramUser.id,
              firstName: telegramUser.firstName,
              username: telegramUser.username,
              is_premium: telegramUser.is_premium,
            };
            dispatch(setUser(userData));
          }
        }
      } else {
        console.log("Running outside Telegram - using mock data");
        const mockUser = {
          id: 123456789,
          telegramId: 123456789,
          firstName: "Test User",
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
