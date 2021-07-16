<script lang="ts">
  import { fetchAssets, fetchSchemas } from "../../domain/Asset";
  import type { OwnedAsset } from "../../domain/Asset";
  import AssetsSummary from "./AssetsSummary.svelte";
  import type { ApiSchema } from "atomicassets/build/API/Explorer/Types";
  import Selector from "../Selector.svelte";
  import type { ApiAsset } from "../../external/AtomicAssets";
  import { MIRRORS, DEFAULT_MIRROR }  from "../../external/AtomicAssets";

  let showDetails = false;
  let hideOwnedBy1 = true;
  let hideOwnedBy2 = true;
  let showOnlyDupes = true;

  export let collection: string;
  let lastCollection: string;

  let schema: ApiSchema;
  let schemas: ApiSchema[] = [];

  let groupingField: string;
  let fields: string[] = [];

  export let account1: string;
  export let account2: string;

  let mirror = DEFAULT_MIRROR;
  let lastMirror;

  interface AssetsGroup {
    field: string;
    assets: OwnedAsset[];
  }

  let assets: ApiAsset[];
  let groupedAssets: Map<string, AssetsGroup>;

  let loadingAccount1 = false;
  let loadingAccount2 = false;
  let loadingCollection = false;

  $: disabled = !(account1 && account2 && collection && schema && account1 !== account2);

  $: if (collection || schema) {
    if (!schema) {
      fields = [];
    } else {
      fields = schema.format.map(sf => sf.name);
    }
  }

  function onCollectionChange() {
    if (collection !== lastCollection) {
      loadingCollection = true;
      schema = undefined;
      schemas = [];
      fetchSchemas(collection, mirror.url)
        .then(r => schemas = r)
        .finally(() => loadingCollection = false);
      lastCollection = collection;
    }
  }

  function calculateTemplates(): Map<string, { count: number, first: string }> {
    const map = new Map<string, { count: number, first: string }>();
    for (let asset of assets) {
      const key = asset.owner + ":" + asset.template.template_id;
      if (map.has(key)) {
        const entry = map.get(key);
        entry.count = entry.count + 1;
      } else {
        map.set(key, { count: 1, first: asset.asset_id});
      }
    }
    return map;
  }

  function groupAssets() {
    if (assets) {
      if (!groupingField) {
        groupingField = "name";
      }
      const templatesMap = calculateTemplates();
      const map = new Map<string, AssetsGroup>();
      console.log("Grouping assets by " + groupingField)
      for (let asset of assets) {
        const template = asset.template.template_id;
        const templateSummary = templatesMap.get(asset.owner + ":" + template);
        const other = asset.owner === account1 ? account2 : account1;
        const otherHasOne = templatesMap.has(other + ":" + template);
        const isFirst = templateSummary.first === asset.asset_id;
        const copies = templateSummary.count;
        const fieldVal = asset.data[groupingField];

        if (map.has(fieldVal)) {
          map.get(fieldVal).assets.push({...asset, otherHasOne, isFirst, copies});
        } else {
          map.set(fieldVal, { field: fieldVal, assets: [{...asset, otherHasOne, isFirst, copies}]});
        }
      }
      groupedAssets = map;
      console.log("Groups result", groupedAssets);
    }
  }

  async function searchAssets() {
    assets = undefined;
    loadingAccount1 = true;
    loadingAccount2 = true;
    const resultingAssets = [];
    await Promise.all([
      fetchAssets(account1, collection, schema.schema_name, mirror.url).then(r => {
        r.forEach(el => resultingAssets.push(el));
      }).finally(() => {
        loadingAccount1 = false;
      }),
      fetchAssets(account2, collection, schema.schema_name, mirror.url).then(r => {
        r.forEach(el => resultingAssets.push(el));
      }).finally(() => {
        loadingAccount2 = false;
      })
    ]).then(() => {
      assets = resultingAssets;
      groupAssets();
    }).catch(err => window.alert(`Error fetching assets: ${err}`));
  }

  function filterAssets(group: AssetsGroup, owner: string, hideOwnedByOther: boolean, showOnlyDupes: boolean): OwnedAsset[] {
    return group.assets
      .filter(a => a.owner === owner)
      .filter(a => {
        if (showOnlyDupes) {
          return !a.isFirst;
        }
        return true;
      })
      .filter(a => {
        if (hideOwnedByOther) {
          return !a.otherHasOne;
        }
        return true;
      }).sort((a, b) => {
        const akey = a.name + ":" + a.template_mint.padStart(10, "0");
        const bkey = b.name + ":" + b.template_mint.padStart(10, "0");
        return akey.localeCompare(bkey);
      });
  }
</script>

<div class="p-5">
  <p>This tool shows each accounts assets with the aim of helping find possible trades.</p>
  <p>
    If you find any issues please report them over <a href="https://github.com/LucasJC/wax-collector/issues" target="_blank">here</a>.
  </p>
</div>

<div class="section">
  <Selector id="mirror" label="API Mirror" bind:value={mirror} options={MIRRORS} description={m => m.name} />
  <div class="field">
    <label class="label" for="collection">Collection</label>
    <div class="control has-icons-left" class:is-loading={loadingCollection}>
      <input id="collection" class="input" type="text" placeholder="Collection" 
        bind:value={collection} 
        on:focusout={onCollectionChange}
        on:keyup={e=>e.key==='Enter' && onCollectionChange()}
      >
      {#if schemas && schemas.length > 0}
        <span class="icon is-left has-text-success" data-tooltip="Collection [{collection}] OK">
          <i class="fas fa-check-square"></i>
        </span>
      {:else}
        <span class="icon is-left has-text-danger" data-tooltip="Collection [{collection}] not found">
          <i class="fas fa-ban"></i>
        </span>
      {/if}
    </div>
  </div>

  <Selector id="schema" label="Schema" bind:value={schema} options={schemas} description={sch => sch.schema_name} loader={loadingCollection}/>

  <Selector id="group" label="Group By" bind:value={groupingField} options={fields} description={f => f} loader={loadingCollection}/>

  <form>
    <p class="label">Accounts</p>
    <div class="field is-grouped">
      <div class="control is-expanded" class:is-loading={loadingAccount1}>
        <input class="input" type="text" placeholder="WAX Account 1" bind:value="{account1}">
      </div>
      <div class="control is-expanded" class:is-loading={loadingAccount2}>
        <input class="input" type="text" placeholder="WAX Account 2" bind:value="{account2}">
      </div>
      <div class="control">
        <button class="button is-info" on:click|preventDefault="{searchAssets}" {disabled}>
          Search
        </button>
      </div>
    </div>
  </form>
  <hr class="m-6">
  <div>
    <p class="label">Live settings</p>
    <div class="field">
      <label class="checkbox">
        <input type="checkbox" bind:checked={showDetails}>
        Show asset details
      </label>
    </div>
    <div class="field">
      <label class="checkbox">
        <input type="checkbox" bind:checked={hideOwnedBy1}>
        Hide {account2 ?? "Account 2"} assets already owned by {account1 ?? "Account 1"}
      </label>
    </div>
    <div class="field">
      <label class="checkbox">
        <input type="checkbox" bind:checked={hideOwnedBy2}>
        Hide {account1 ?? "Account 1"} assets already owned by {account2 ?? "Account 2"}
      </label>
    </div>
    <div class="field">
      <label class="checkbox">
        <input type="checkbox" bind:checked={showOnlyDupes}>
        Show only assets with duplicates
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
            <td><AssetsSummary assets={filterAssets(group, account1, hideOwnedBy2, showOnlyDupes)} otherAccount={account2} {showDetails} /></td>
            <td><AssetsSummary assets={filterAssets(group, account2, hideOwnedBy1, showOnlyDupes)} otherAccount={account1} {showDetails} /></td>
          </tr>
        {/each}
      </table>
    </div>
  {/if}
  
</div>