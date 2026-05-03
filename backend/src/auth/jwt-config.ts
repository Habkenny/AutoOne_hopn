import { ConfigService } from "@nestjs/config";

export function getJwtSecret(config: ConfigService, key: "JWT_SECRET" | "JWT_REFRESH_SECRET") {
  const value = config.get<string>(key);
  if (value) return value;

  if (config.get<string>("NODE_ENV") === "production") {
    throw new Error(`${key} must be configured in production.`);
  }

  return key === "JWT_SECRET" ? "development-secret" : "development-refresh-secret";
}
