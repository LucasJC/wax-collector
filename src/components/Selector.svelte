<script lang="ts">
  type A = $$Generic;
  export let value: A;
  export let id: string;
  export let label: string;
  export let description: (opt: A) => string = opt => opt.toString();
  export let options: Array<A>;
  export let loader: boolean | undefined = false;
</script>

<div class="field">
  {#if label}
    <label class="label" for="{id}">{label}</label>
  {/if}
  <div class="control has-icons-left">
    <div class="select">
      <select {id} bind:value={value}>
        <option value={undefined}>Select one</option>
        {#if options}
          {#each options as opt}
            <option value={opt}>{description(opt)}</option>
          {/each}
        {/if}
      </select>
      {#if !loader}
        {#if value}
          <span class="icon">
            <i class="fas fa-check-square"></i>
          </span>
        {:else}
          <span class="icon">
            <i class="fas fa-ban"></i>
          </span>
        {/if}
      {:else}
        <span class="icon is-left">
          <i class="fas fa-spinner fa-pulse"></i>
        </span>
      {/if}
    </div>
  </div>
</div>