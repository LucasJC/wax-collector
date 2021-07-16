export type { ApiCollection, ApiSchema, ApiTemplate, ApiAsset } from "atomicassets/build/API/Explorer/Types";
import { ExplorerApi } from "atomicassets";

export const DEFAULT_MIRROR: Mirror = {
  name: "EOSAmsterdam",
  url: "https://wax-aa.eu.eosamsterdam.net"
};

export const MIRRORS: Mirror[] = [
  {
    name: "3DKRender",
    url: "https://atomic.3dkrender.com"
  },
  DEFAULT_MIRROR,
  {
    name: "EOSphere Guild",
    url: "https://wax-atomic-api.eosphere.io"
  },
  {
    name: "LiquidStudios",
    url: "https://api.wax.liquidstudios.io"
  },
  {
    name: "pink.gg",
    url: "https://wax.api.atomicassets.io"
  },
  {
    name: "WizardsGuildBP",
    url: "https://wax-atomic.wizardsguild.one"
  },
]

export interface Mirror {
  name: string,
  url: string
}

export function atomicAssets(apiURL = DEFAULT_MIRROR.url): ExplorerApi {
  if (window) {
    (window as any).global = window;
  }
  return new ExplorerApi(apiURL, "atomicassets", {});
}