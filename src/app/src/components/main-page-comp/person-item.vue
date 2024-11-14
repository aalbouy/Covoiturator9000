<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: String,
  emoji: String,
  money: Number,
  is_fav: [Boolean, Number],
  id: Number,
})

const localIsFav = ref(props.is_fav)

const is_selected = ref(false)

// Computed property to dynamically set the icon class based on `isActive`
const icon_class = computed(() =>
  localIsFav.value ? 'mdi mdi-star' : 'mdi mdi-star-outline',
)

const background_class = computed(() =>
  is_selected.value
    ? 'has-background-primary has-text-primary-light-invert'
    : 'has-background-dark has-text-primary-light',
)

function toggle_fav() {
  localIsFav.value = !localIsFav.value
  emits('fav-updated', props.id, localIsFav.value)
}

function toggle_selected() {
  is_selected.value = !is_selected.value
  emits('sel-updated', props.id, is_selected.value)
}

function reset_selected() {
  is_selected.value = false
  emits('sel-updated', props.id, is_selected.value)
}

defineExpose({ reset_selected })

const emits = defineEmits(['fav-updated', 'sel-updated'])
</script>

<template>
  <div
    :class="background_class"
    class="cell custom-box py-3 px-4 has-radius-normal"
    @click="toggle_selected"
  >
    <div
      class="top-left has-text-weight-bold is-family-primary is-size-5 is-unselectable"
    >
      {{ props.name }}
    </div>
    <span class="top-right icon is-size-4" @click="toggle_fav" v-on:click.stop>
      <i :class="icon_class"></i>
    </span>
    <div class="is-size-4 emoji-person is-unselectable">{{ props.emoji }}</div>
    <div class="bottom-right has-text-primary-light">
      {{ props.money.toFixed(2) }}€
    </div>
  </div>
</template>
