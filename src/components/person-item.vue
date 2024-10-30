<script setup>
import { ref } from 'vue'
import { mdiStarDavid } from '@mdi/js'

const props = defineProps({
  name: String,
  money_due: Number,
  is_fav: Boolean,
})

function toggle_fav() {
  console.log('toggle_fav')
  is_fav.value = !is_fav.value
}
</script>

<template>
  <div
    class="cell py-3 px-4 has-background-primary has-text-primary-light-invert has-radius-normal person"
  >
    <div class="fixed-grid">
      <div class="grid">
        <div class="has-text-weight-bold is-family-primary is-size-2">
          {{ name }}
        </div>
        <div class="has-text-right">
          <span class="icon" @click="toggle_fav">
            <i class="mdi {{ is_fav ? mdi-star-outline : mdi-star }}"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
