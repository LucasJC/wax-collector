import { AssetSort, SortOrder } from "atomicmarket/build/API/Explorer/Types";
import { ApiCollection, atomicAssets, ApiSchema, ApiAsset } from "../external/AtomicAssets";
export type { ListingAsset } from "../external/AtomicMarket";
export type { ApiSchema } from "../external/AtomicAssets";

export interface OwnedAsset extends ApiAsset {
  otherHasOne: boolean;
  isFirst: boolean;
  copies: number;
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

export async function fetchAssets(account: string, collection: string, schema: string, onlyDupes = false): Promise<ApiAsset[]> {
  const LIMIT = 500;
  const api = atomicAssets();
  let more = true;
  let page = 0;
  let result: ApiAsset[] = [];
  while (more) {
    const assets = await api.getAssets({
      owner: account,
      collection_name: collection,
      schema_name: schema,
      only_duplicate_templates: onlyDupes,
      sort: AssetSort.AssetId,
      order: SortOrder.Asc
    }, page, LIMIT);
    if (assets.length < LIMIT) {
      more = false;
    }
    page++;
    result = result.concat(assets);
  }
  return result;
}