import { AssetSort, SortOrder } from "atomicmarket/build/API/Explorer/Types";
import { ApiCollection, atomicAssets, ApiSchema, ApiAsset, DEFAULT_MIRROR } from "../external/AtomicAssets";
export type { ListingAsset } from "../external/AtomicMarket";
export type { ApiSchema } from "../external/AtomicAssets";
export interface OwnedAsset extends ApiAsset {
  otherHasOne: boolean;
  isFirst: boolean;
  copies: number;
}

export async function fetchCollection(collection: string, apiMirror: string): Promise<ApiCollection> {
  const api = atomicAssets(apiMirror);
  return api.getCollection(collection.toLowerCase());
}

export async function fetchSchemas(collection: string, apiMirror: string): Promise<ApiSchema[]> {
  const api = atomicAssets(apiMirror);
  return api.getSchemas({
    collection_name: collection.toLowerCase(),
    sort: "schema_name"
  })
}

export async function fetchAssets(account: string, collection: string, schema: string, apiMirror: string, onlyDupes = false): Promise<ApiAsset[]> {
  const LIMIT = 500;
  const api = atomicAssets(apiMirror);
  let more = true;
  let page = 1;
  let result: ApiAsset[] = [];
  while (more) {
    const assets = await api.getAssets({
      owner: account,
      collection_name: collection.toLowerCase(),
      schema_name: schema,
      only_duplicate_templates: onlyDupes,
      sort: AssetSort.AssetId,
      order: SortOrder.Asc
    }, page, LIMIT);
    if (assets.length < LIMIT) {
      more = false;
    }
    page = page + 1;
    result = [...result, ...assets];
  }
  return result;
}