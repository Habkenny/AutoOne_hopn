import { createContext, useContext, useMemo, useReducer } from "react";

const initialState = {
  selectedService: null,
  rentalBooking: {
    carId: "",
    startDate: "",
    endDate: "",
    extras: [],
  },
  importRequest: {
    region: "EU",
    carId: "",
    destination: "",
  },
  financeApplication: {
    carPrice: 28000,
    downPayment: 5000,
    duration: 48,
    interestRate: 5.9,
    selectedBankId: "",
  },
  activeModal: null,
};

const MarketplaceContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "service/select":
      return { ...state, selectedService: action.payload };
    case "rental/update":
      return { ...state, rentalBooking: { ...state.rentalBooking, ...action.payload } };
    case "imports/update":
      return { ...state, importRequest: { ...state.importRequest, ...action.payload } };
    case "finance/update":
      return { ...state, financeApplication: { ...state.financeApplication, ...action.payload } };
    case "ui/modal":
      return { ...state, activeModal: action.payload };
    default:
      return state;
  }
}

export function MarketplaceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      selectService: (service) => dispatch({ type: "service/select", payload: service }),
      updateRentalBooking: (payload) => dispatch({ type: "rental/update", payload }),
      updateImportRequest: (payload) => dispatch({ type: "imports/update", payload }),
      updateFinanceApplication: (payload) => dispatch({ type: "finance/update", payload }),
      setActiveModal: (modal) => dispatch({ type: "ui/modal", payload: modal }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [actions, state]);

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within MarketplaceProvider");
  }
  return context;
}
