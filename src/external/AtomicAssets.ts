export type { ApiCollection, ApiSchema, ApiTemplate, ApiAsset } from "atomicassets/build/API/Explorer/Types";
import { ExplorerApi } from "atomicassets";

export function atomicAssets(): ExplorerApi {
  if (window) {
    (window as any).global = window;
  }
  return new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {});
}