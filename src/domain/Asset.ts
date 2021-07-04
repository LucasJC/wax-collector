import { ApiCollection, atomicAssets, ApiSchema } from "../external/AtomicAssets";
import { atomicMarket, ListingAsset } from "../external/AtomicMarket";
export type { ListingAsset } from "../external/AtomicMarket";
export type { ApiSchema } from "../external/AtomicAssets";

export interface OwnedAsset extends ListingAsset {
  otherHasOne: boolean;
}

export async function fetchCollection(collection: string): Promise<ApiCollection> {
  const api = atomicAssets();
  return api.getCollection(collection);
}

export async function fetchSchemas(collection: string): Promise<ApiSchema[]> {
  const api = atomicAssets();
  return api.getSchemas({
    collection_name: collection,
    sort: "schema_name"
  })
}

export async function fetchAssets(account: string, collection: string, schema: string): Promise<ListingAsset[]> {
  const LIMIT = 100;
  const api = atomicMarket();
  let more = true;
  let page = 0;
  let result: ListingAsset[] = [];
  while (more) {
    const assets = await api.getAssets({
      owner: account,
      collection_name: collection,
      schema_name: schema,
    }, page, LIMIT);
    if (assets.length < LIMIT) {
      more = false;
    }
    page++;
    result = result.concat(assets);
  }
  return result;
}