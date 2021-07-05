<script lang="ts">
  import type { OwnedAsset } from "../../domain/Asset";

  export let assets: OwnedAsset[];
  export let otherAccount: string;
  export let showDetails = false;
  const dataFields = ["i.d.","rarity", "subset", "variant", "variation"];
</script>

<div>
  {#if assets}
    <table class="table is-fullwidth has-text-centered is-hcentered">
      {#each assets as asset}
        <tr>
          <div class="m-2">
            <a href=https://wax.atomichub.io/explorer/asset/{asset.asset_id} target="_blank">
              {asset.name} #{asset["template_mint"]}
            </a>
            {#if asset.otherHasOne}
              <span class="icon has-text-success" data-tooltip="{otherAccount} has one">
                <i class="fas fa-check-square"></i>
              </span>
            {:else}
              <span class="icon has-text-danger" data-tooltip="{otherAccount} doesn't have one">
                <i class="fas fa-ban"></i>
              </span>
            {/if}
            {#if showDetails}
              <div class="mt-2">
                <table class="table is-fullwidth has-text-centered is-hcentered">
                  <tr>
                    <th>Name</th>
                    <td>{asset.name}</td>
                  </tr>
                  <tr>
                    <th>Mint</th>
                    <td>{asset["template_mint"]}</td>
                  </tr>
                  <tr>
                    <th>Asset ID</th>
                    <td>{asset.asset_id}</td>
                  </tr>
                  {#each Object.entries(asset.data) as [key, value]}
                    {#if dataFields.includes(key.toLowerCase())}
                      <tr>
                        <th>{key}</th>
                        <td>{value}</td>
                      </tr>
                    {/if}
                  {/each}
                </table>
              </div>
            {/if}
          </div>
        </tr>
      {/each}
    </table>
  {/if}
</div>