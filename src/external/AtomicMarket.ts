export type { ListingAsset } from "atomicmarket/build/API/Explorer/Types";
import { ExplorerApi } from "atomicmarket";

export function atomicMarket(): ExplorerApi {
  if (window) {
    (window as any).global = window;
  }
  return new ExplorerApi("https://wax.api.atomicassets.io", "atomicmarket", {});
}