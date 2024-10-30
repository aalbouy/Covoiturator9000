<script setup>
import { ref } from 'vue'
import { mdiStarDavid } from '@mdi/js'

const props = defineProps({
  name: String,
  money_due: Number,
  is_fav: Boolean,
})
</script>

<template>
  <div
    class="cell py-3 px-4 has-background-primary has-text-primary-light-invert has-radius-normal person"
  >
    <div class="has-text-weight-bold is-family-primary is-size-2">
      {{ name }}
    </div>
    <button class="button has-background-primary">⭐</button>
    <span class="icon has-text-dark">
      <i class="mdi mdi-signal-4g mdi-star-david"></i>
    </span>
  </div>
</template>
