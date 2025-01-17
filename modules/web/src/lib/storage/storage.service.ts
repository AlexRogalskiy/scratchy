import { LocalStorage, SessionStorage, CookieStorage } from "@jmondi/browser-storage";
import { browser } from "$app/env";

class SsrAdapter {
  clear = () => {};
  get = (_: string) => null;
  remove = (_: string) => {};
  set = (_: string, __?: any, ___?: any) => {};
}

export const localStorageService = browser ? new LocalStorage() : new SsrAdapter();
export const sessionStorageService = browser ? new SessionStorage() : new SsrAdapter();
export const cookieStorageService = browser ? new CookieStorage() : new SsrAdapter();

const prefix = "a_";

export const COOKIES = {
  canRefresh: prefix + "canRefresh",
  accessToken: prefix + "accessToken",
};

export const SESSIONS = {
  currentUser: prefix + "currentUser",
};
