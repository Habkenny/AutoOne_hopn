import { getProviderById, getProviders } from "../../services/mockApi.js";

export const carwashFeature = {
  type: "carwash",
  listProviders: (filters) => getProviders("carwash", filters),
  getProvider: (id) => getProviderById("carwash", id),
};
