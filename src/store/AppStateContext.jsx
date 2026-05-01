import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { readStorage, writeStorage } from "../utils/storage.js";

const initialUser = {
  id: "user-1",
  name: "Alex Driver",
  email: "alex@autoone.app",
  phone: "+49 170 555 0123",
  language: "en",
};

const initialBookings = [
  {
    id: "bk-1001",
    providerId: "w-1",
    providerName: "Prime Auto Workshop",
    serviceType: "workshops",
    date: "2026-05-04",
    time: "09:00",
    car: "BMW 3 Series",
    status: "confirmed",
    price: 45,
  },
  {
    id: "bk-1002",
    providerId: "c-1",
    providerName: "Aqua Shine Car Wash",
    serviceType: "carwash",
    date: "2026-04-22",
    time: "13:00",
    car: "Toyota Corolla",
    status: "completed",
    price: 18,
  },
];

const initialNotifications = [
  {
    id: "nt-1",
    type: "confirmed",
    title: "Booking confirmed",
    message: "Prime Auto Workshop confirmed your service for May 4.",
    timestamp: "5 min ago",
    read: false,
  },
  {
    id: "nt-2",
    type: "reminder",
    title: "Service reminder",
    message: "Your car wash appointment is tomorrow at 13:00.",
    timestamp: "1 hr ago",
    read: false,
  },
  {
    id: "nt-3",
    type: "cancelled",
    title: "Cancellation processed",
    message: "A previous booking was moved to cancelled.",
    timestamp: "Yesterday",
    read: true,
  },
];

const initialState = {
  auth: readStorage("autoone.auth", { isAuthenticated: true, user: initialUser }),
  bookings: readStorage("autoone.bookings", initialBookings),
  favorites: readStorage("autoone.favorites", []),
  notifications: readStorage("autoone.notifications", initialNotifications),
  theme: readStorage("autoone.theme", "light"),
  currency: readStorage("autoone.currency", "USD"),
  toasts: [],
};

const AppStateContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "auth/login":
      return {
        ...state,
        auth: { isAuthenticated: true, user: { ...initialUser, ...action.payload } },
      };
    case "auth/logout":
      return {
        ...state,
        auth: { isAuthenticated: false, user: null },
      };
    case "auth/updateProfile":
      return {
        ...state,
        auth: {
          ...state.auth,
          user: { ...state.auth.user, ...action.payload },
        },
      };
    case "booking/add":
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        notifications: [
          {
            id: `nt-${Date.now()}`,
            type: "confirmed",
            title: "Booking request sent",
            message: `${action.payload.providerName} received your booking request.`,
            timestamp: "Just now",
            read: false,
          },
          ...state.notifications,
        ],
      };
    case "booking/status":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload.id
            ? { ...booking, status: action.payload.status }
            : booking
        ),
      };
    case "favorite/toggle": {
      const exists = state.favorites.some((item) => item.id === action.payload.id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((item) => item.id !== action.payload.id)
          : [action.payload, ...state.favorites],
      };
    }
    case "notification/markRead":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };
    case "notification/markAllRead":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
      };
    case "theme/set":
      return { ...state, theme: action.payload };
    case "currency/set":
      return { ...state, currency: action.payload };
    case "toast/add":
      return { ...state, toasts: [...state.toasts, action.payload] };
    case "toast/remove":
      return { ...state, toasts: state.toasts.filter((toast) => toast.id !== action.payload) };
    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => writeStorage("autoone.auth", state.auth), [state.auth]);
  useEffect(() => writeStorage("autoone.bookings", state.bookings), [state.bookings]);
  useEffect(() => writeStorage("autoone.favorites", state.favorites), [state.favorites]);
  useEffect(() => writeStorage("autoone.notifications", state.notifications), [state.notifications]);
  useEffect(() => writeStorage("autoone.theme", state.theme), [state.theme]);
  useEffect(() => writeStorage("autoone.currency", state.currency), [state.currency]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  const actions = useMemo(
    () => ({
      login: (payload) => dispatch({ type: "auth/login", payload }),
      logout: () => dispatch({ type: "auth/logout" }),
      updateProfile: (payload) => dispatch({ type: "auth/updateProfile", payload }),
      addBooking: (payload) => dispatch({ type: "booking/add", payload }),
      updateBookingStatus: (id, status) =>
        dispatch({ type: "booking/status", payload: { id, status } }),
      toggleFavorite: (provider) => dispatch({ type: "favorite/toggle", payload: provider }),
      markNotificationRead: (id) => dispatch({ type: "notification/markRead", payload: id }),
      markAllNotificationsRead: () => dispatch({ type: "notification/markAllRead" }),
      setTheme: (theme) => dispatch({ type: "theme/set", payload: theme }),
      setCurrency: (currency) => dispatch({ type: "currency/set", payload: currency }),
      addToast: (toast) => {
        const id = `toast-${Date.now()}`;
        dispatch({ type: "toast/add", payload: { id, type: "success", ...toast } });
        window.setTimeout(() => dispatch({ type: "toast/remove", payload: id }), 3500);
      },
      removeToast: (id) => dispatch({ type: "toast/remove", payload: id }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [actions, state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
