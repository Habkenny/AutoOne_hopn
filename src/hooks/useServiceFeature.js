import { carwashFeature } from "../features/carwash/index.js";
import { workshopsFeature } from "../features/workshops/index.js";

const features = {
  [workshopsFeature.type]: workshopsFeature,
  [carwashFeature.type]: carwashFeature,
};

export function useServiceFeature(serviceType) {
  return features[serviceType] ?? null;
}
