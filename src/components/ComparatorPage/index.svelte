<script lang="ts">
  import { fetchAssets, fetchSchemas } from "../../domain/Asset";
  import type { ListingAsset, OwnedAsset } from "../../domain/Asset";
  import AssetsSummary from "./AssetsSummary.svelte";
  import type { ApiSchema } from "atomicassets/build/API/Explorer/Types";
  import Selector from "../Selector.svelte";

  let showDetails = false;
  let hideOwnedBy1 = false;
  let hideOwnedBy2 = false;

  export let collection: string;
  let lastCollection: string;

  let schema: ApiSchema;
  let schemas: ApiSchema[] = [];

  let groupingField: string;
  let fields: string[] = [];

  export let account1: string;
  export let account2: string;

  interface AssetsGroup {
    field: string;
    assets: OwnedAsset[];
  }

  let assets: ListingAsset[];
  let groupedAssets: Map<string, AssetsGroup>;

  let loading1 = false;
  let loading2 = false;

  $: disabled = !(account1 && account2 && collection && schema);

  $: if (collection || schema) {
    if (!schema) {
      fields = [];
    } else {
      fields = schema.format.map(sf => sf.name);
    }
  }

  function onCollectionChange() {
    if (collection !== lastCollection) {
      schema = undefined;
      schemas = [];
      fetchSchemas(collection).then(r => schemas = r);
      lastCollection = collection;
    }
  }

  function groupAssets() {
    if (assets) {
      if (!groupingField) {
        groupingField = "name";
      }
      const account1Templates = new Set(assets.filter(a => a.owner === account1).map(a => a.template.template_id));
      const account2Templates = new Set(assets.filter(a => a.owner === account2).map(a => a.template.template_id));

      const map = new Map<string, AssetsGroup>();
      console.log("Grouping assets by " + groupingField)
      for (let asset of assets) {
        const fieldVal = asset.data[groupingField];

        let otherHasOne = false;
        if (asset.owner === account1) {
          otherHasOne = account2Templates.has(asset.template.template_id);
        } else {
          otherHasOne = account1Templates.has(asset.template.template_id);
        }

        if (map.has(fieldVal)) {
          map.get(fieldVal).assets.push({...asset, otherHasOne});
        } else {
          map.set(fieldVal, { field: fieldVal, assets: [{...asset, otherHasOne}]});
        }
      }
      groupedAssets = map;
    }
  }

  async function searchAssets() {
    assets = undefined;
    loading1 = true;
    loading2 = true;
    const resultingAssets = [];
    await Promise.all([
      fetchAssets(account1, collection, schema.schema_name).then(r => {
        r.forEach(el => resultingAssets.push(el));
      }).finally(() => {
        loading1 = false;
      }),
      fetchAssets(account2, collection, schema.schema_name).then(r => {
        r.forEach(el => resultingAssets.push(el));
      }).finally(() => {
        loading2 = false;
      })
    ]).then(() => {
      assets = resultingAssets;
      groupAssets();
    }).catch(err => window.alert(`Error fetching assets: ${err}`));
  }

  function filterAssets(group: AssetsGroup, owner: string, hideOwnedByOther: boolean): OwnedAsset[] {
    return group.assets.filter(a => a.owner === owner).filter(a => {
      if (hideOwnedByOther) {
        return !a.otherHasOne;
      }
      return true;
    });
  }
</script>

<div class="section">
  <div class="field">
    <label class="label" for="collection">Collection</label>
    <div class="control is-expanded">
      <input id="collection" class="input" type="text" placeholder="Collection" 
        bind:value={collection} 
        on:focusout={onCollectionChange}
        on:keyup={e=>e.key==='Enter' && onCollectionChange()}
      >
    </div>
  </div>

  <Selector id="schema" label="Schema" bind:value={schema} options={schemas} description={sch => sch.schema_name}/>

  <Selector id="group" label="Group By" bind:value={groupingField} options={fields} description={f => f}/>

  <form>
    <p class="label">Accounts</p>
    <div class="field is-grouped">
      <div class="control is-expanded" class:is-loading={loading1}>
        <input class="input" type="text" placeholder="WAX Account 1" bind:value="{account1}">
      </div>
      <div class="control is-expanded" class:is-loading={loading2}>
        <input class="input" type="text" placeholder="WAX Account 2" bind:value="{account2}">
      </div>
      <div class="control">
        <button class="button is-info" on:click|preventDefault="{searchAssets}" {disabled}>
          Search
        </button>
      </div>
    </div>
  </form>

  <div class="section">
    <p class="label">Other settings</p>
    <div class="field">
      <label class="checkbox">
        <input type="checkbox" bind:checked={showDetails}>
        Show asset details
      </label>
    </div>
    <div class="field">
      <label class="checkbox">
        <input type="checkbox" bind:checked={hideOwnedBy1}>
        Hide owned by {account1 ?? "Account 1"}
      </label>
    </div>
    <div class="field">
      <label class="checkbox">
        <input type="checkbox" bind:checked={hideOwnedBy2}>
        Hide owned by {account2 ?? "Account 2"}
      </label>
    </div>
  </div>

  {#if account1 && account2 && assets && groupedAssets}
    <div class="section">
      <table class="table is-bordered is-narrow is-fullwidth has-text-centered is-hcentered is-vcentered">
        <tr>
          <th>Group</th>
          <th>{account1}</th>
          <th>{account2}</th>
        </tr>
        {#each [...groupedAssets] as [field, group]}
          <tr>
            <td>{field ? field : ""}</td>
            <td><AssetsSummary assets={filterAssets(group, account1, hideOwnedBy2)} otherAccount={account2} {showDetails} /></td>
            <td><AssetsSummary assets={filterAssets(group, account2, hideOwnedBy1)} otherAccount={account1} {showDetails} /></td>
          </tr>
        {/each}
      </table>
    </div>
  {/if}
  
</div>