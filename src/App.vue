<script setup>
import { ref, computed, nextTick } from 'vue'
import Person from './components/person-item.vue'
import RideSelector from './components/ride-selector.vue'

const popupInput = ref(null)

const persons = ref([])
const new_person_name = ref('')
const new_person_emoji = ref('')
const id_person = ref('')

const price_per_km = ref(0.12)

const id_ride = ref('')
const rides = ref([
  {
    id: id_ride.value++,
    name: '🍔 BK',
    price: 3.21,
  },
  {
    id: id_ride.value++,
    name: '💼 Travail',
    price: 4.56,
  },
])

const modal_opened = ref(false)

function add_person() {
  if (
    new_person_name.value.length === 0 ||
    new_person_emoji.value.length === 0
  ) {
    return
  }

  persons.value.push({
    id: id_person.value++,
    name: new_person_name.value,
    emoji: new_person_emoji.value,
    money_due: 0.0,
    is_fav: false,
    force: 0,
    is_selected: false,
  })

  if (modal_opened.value) {
    toggle_modal()
  }

  new_person_name.value = ''
  new_person_emoji.value = ''
}

function handle_emit_fav(name, fav) {
  const person = persons.value.find(i => i.name === name)
  if (person) {
    person.is_fav = fav
  }
}

function handle_emit_sel(name, sel) {
  const person = persons.value.find(i => i.name === name)
  if (person) {
    person.is_selected = sel
  }
}

function handle_emit_new_ride(name, price) {
  rides.value.push({
    id: id_ride.value++,
    name: name,
    price: price,
  })
}

function toggle_modal() {
  if (new_person_name.value.length === 0) {
    return
  }

  new_person_emoji.value = '🦖'

  modal_opened.value = !modal_opened.value

  if (modal_opened.value) {
    nextTick(() => {
      // Wait until the DOM is updated before focusing
      if (popupInput.value) {
        popupInput.value.focus()
      }
    })
  }
}

const nb_person_sel = computed(() => {
  return persons.value.filter(p => {
    return p.is_selected
  }).length
})

const sorted_persons = computed(() => {
  return persons.value.slice().sort((a, b) => {
    // First, sort by favorite status (favorited items come first)
    if (a.is_fav === b.is_fav) {
      // If both have the same favorite status, sort alphabetically by name
      return a.name.localeCompare(b.name)
    }
    return a.is_fav ? -1 : 1
  })
})
</script>

<template>
  <div
    id="modal-validation"
    :class="{ 'is-active': modal_opened }"
    class="modal"
  >
    <div class="modal-background" @click="toggle_modal"></div>
    <div class="modal-content valid-popup">
      <div class="box">
        <p class="is-size-5 has-text-centered mb-4">
          Choisir l'émoji pour {{ new_person_name }} ?
        </p>
        <input
          ref="popupInput"
          class="input mb-4 mgl-large mgr-large"
          type="text"
          placeholder="🤪"
          v-model="new_person_emoji"
        />
        <div class="buttons is-centered mb-4">
          <button class="button is-success" @click="add_person">Valider</button>
          <button class="button is-danger" @click="toggle_modal">
            Annuler
          </button>
        </div>
      </div>
    </div>
    <button
      class="modal-close is-large"
      @click="toggle_modal"
      aria-label="close"
    ></button>
  </div>
  <div class="container is-three-quarters is-centered">
    <RideSelector
      v-model:rides="rides"
      v-model:nb_persons="nb_person_sel"
      v-model:price_per_km="price_per_km"
      @new-ride="handle_emit_new_ride"
    />
    <hr class="has-text-centered" />
    <div class="field is-grouped is-justify-content-center">
      <p class="control is-expanded">
        <input
          class="input"
          type="text"
          placeholder="Nom"
          v-model="new_person_name"
          @keyup.enter="toggle_modal"
        />
      </p>
      <p class="control">
        <button @click="toggle_modal" class="button is-info">Ajouter</button>
      </p>
    </div>
    <div class="fixed-grid has-2-cols">
      <div class="grid">
        <div v-for="p in sorted_persons" :key="p.id">
          <Person
            :name="p.name"
            :emoji="p.emoji"
            @sel-updated="handle_emit_sel"
            @fav-updated="handle_emit_fav"
          />
        </div>
      </div>
    </div>
  </div>
</template>
