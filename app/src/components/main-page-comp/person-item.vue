<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: String,
  emoji: String,
})

const money_due = ref(0)
const is_fav = ref(false)
const is_selected = ref(false)

// Computed property to dynamically set the icon class based on `isActive`
const icon_class = computed(() =>
  is_fav.value ? 'mdi mdi-star' : 'mdi mdi-star-outline',
)

const background_class = computed(() =>
  is_selected.value
    ? 'has-background-primary has-text-primary-light-invert'
    : 'has-background-dark has-text-primary-light',
)

function toggle_fav() {
  is_fav.value = !is_fav.value
  emits('fav-updated', props.name, is_fav.value)
}

function toggle_selected() {
  is_selected.value = !is_selected.value
  emits('sel-updated', props.name, is_selected.value)
}

const emits = defineEmits(['fav-updated', 'sel-updated'])
</script>

<template>
  <div
    :class="background_class"
    class="cell custom-box py-3 px-4 has-radius-normal"
    @click="toggle_selected"
  >
    <div
      class="top-left has-text-weight-bold is-family-primary is-size-2 is-unselectable"
    >
      {{ name }}
    </div>
    <span class="top-right icon is-size-4" @click="toggle_fav" v-on:click.stop>
      <i :class="icon_class"></i>
    </span>
    <div class="is-size-1 emoji-person is-unselectable">{{ emoji }}</div>
    <div class="bottom-right has-text-primary-light">
      {{ money_due.toFixed(2) }}€
    </div>
  </div>
</template>
