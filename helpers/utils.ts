import { createHmac } from "crypto";

export const PREFERRED_PRECISION = 5;

export const formatExchangeNumber = (numberInStrFormat: string) =>
  parseFloat(numberInStrFormat);

export const signWithSha256 = (queryString: string, apiSecret: string) =>
  createHmac("sha256", apiSecret).update(queryString).digest("hex");
