import { Configs } from "../config";
import { BybitService } from "../exchange";

export const bybitService = new BybitService({
  key: Configs.API_KEY,
  secret: Configs.SECRET_API,
  baseUrl: Configs.MAIN_URL,
  testnet: true,
});
