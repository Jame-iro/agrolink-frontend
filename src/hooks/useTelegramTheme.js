import { useEffect, useState } from "react";
import { telegramService } from "../services/telegram";

export const useTelegramTheme = () => {
  const [isDark, setIsDark] = useState(false);
  const [themeParams, setThemeParams] = useState({});

  useEffect(() => {
    if (telegramService.isTelegram()) {
      const tg = window.Telegram.WebApp;

      setIsDark(tg.colorScheme === "dark");
      setThemeParams(tg.themeParams);

      tg.onEvent("themeChanged", () => {
        setIsDark(tg.colorScheme === "dark");
        setThemeParams(tg.themeParams);
      });
    }
  }, []);

  return {
    isDark,
    themeParams,
    isTelegram: telegramService.isTelegram(),
  };
};
