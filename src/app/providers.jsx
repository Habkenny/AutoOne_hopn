import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MarketplaceProvider } from "../features/shared/MarketplaceContext.jsx";
import { AppStateProvider } from "../store/AppStateContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function DirectionProvider({ children }) {
  const { i18n } = useTranslation();
  const direction = i18n.dir(i18n.language);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = direction;
  }, [direction, i18n.language]);

  return children;
}

export function AppProviders({ children }) {
  const client = useMemo(() => queryClient, []);

  return (
    <QueryClientProvider client={client}>
      <AppStateProvider>
        <MarketplaceProvider>
          <DirectionProvider>{children}</DirectionProvider>
        </MarketplaceProvider>
      </AppStateProvider>
    </QueryClientProvider>
  );
}
