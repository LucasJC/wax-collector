<script lang="ts">
  type A = $$Generic;
  export let value: A;
  export let id: string;
  export let label: string;
  export let description: (opt: A) => string = opt => opt.toString();
  export let options: Array<A>;
</script>

<div class="field">
  {#if label}
    <label class="label" for="{id}">{label}</label>
  {/if}
  <div class="control">
    <div class="select">
      <select {id} bind:value={value}>
        <option value={undefined}>Select one</option>
        {#if options}
          {#each options as opt}
            <option value={opt}>{description(opt)}</option>
          {/each}
        {/if}
      </select>
    </div>
  </div>
</div>