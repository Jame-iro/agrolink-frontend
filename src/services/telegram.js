// Real Telegram Web App service
export class TelegramService {
  constructor() {
    this.tg = window.Telegram?.WebApp;
  }

  isTelegram() {
    return !!this.tg;
  }

  init() {
    if (this.isTelegram()) {
      this.tg.ready();
      this.tg.expand();
      return true;
    }
    return false;
  }

  getUser() {
    return this.tg?.initDataUnsafe?.user;
  }

  getInitData() {
    return this.tg?.initData;
  }

  showMainButton(text, callback) {
    if (!this.isTelegram()) return;

    this.tg.MainButton.setText(text);
    this.tg.MainButton.show();
    this.tg.MainButton.onClick(callback);
  }

  hideMainButton() {
    if (!this.isTelegram()) return;
    this.tg.MainButton.hide();
    this.tg.MainButton.offClick();
  }

  showBackButton(callback) {
    if (!this.isTelegram()) return;
    this.tg.BackButton.show();
    this.tg.BackButton.onClick(callback);
  }

  hideBackButton() {
    if (!this.isTelegram()) return;
    this.tg.BackButton.hide();
    this.tg.BackButton.offClick();
  }

  close() {
    if (!this.isTelegram()) return;
    this.tg.close();
  }

  getThemeParams() {
    return this.tg?.themeParams || {};
  }

  isDarkTheme() {
    return this.tg?.colorScheme === "dark";
  }
}

export const telegramService = new TelegramService();
