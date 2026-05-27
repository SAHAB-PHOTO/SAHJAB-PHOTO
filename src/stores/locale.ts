import { create } from "zustand";
import { persist } from "zustand/middleware";

type Lang = "ar" | "fr";

interface LocaleState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

export const useLocale = create<LocaleState>()(
  persist(
    (set, get) => ({
      lang: "ar",
      setLang: (lang) => {
        set({ lang });
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      },
      toggle: () => {
        const next = get().lang === "ar" ? "fr" : "ar";
        get().setLang(next);
      },
    }),
    {
      name: "halawiyat-locale",
      onRehydrateStorage: () => (state) => {
        if (state?.lang) {
          document.documentElement.lang = state.lang;
          document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
        }
      },
    }
  )
);
