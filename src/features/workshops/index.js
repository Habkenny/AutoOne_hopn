import { getProviderById, getProviders } from "../../services/mockApi.js";

export const workshopsFeature = {
  type: "workshops",
  listProviders: (filters) => getProviders("workshops", filters),
  getProvider: (id) => getProviderById("workshops", id),
};
