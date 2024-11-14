<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import axios from 'axios'

import Person from './main-page-comp/person-item.vue'
import RideSelector from './main-page-comp/ride-selector.vue'

const popupInput = ref(null)
const personDisplay = ref([])

const persons = ref([])
const new_person_name = ref('')
const new_person_emoji = ref('')

const price_per_km = ref(0.12)

const modal_opened = ref(false)

function add_person() {
  if (
    new_person_name.value.length === 0 ||
    new_person_emoji.value.length === 0
  ) {
    return
  }

  axios
    .post('/persons', {
      name: new_person_name.value,
      emoji: new_person_emoji.value,
    })
    .then(updatePersons)
    .catch(function (err) {
      console.log(err)
    })

  if (modal_opened.value) {
    toggle_modal()
  }

  new_person_name.value = ''
  new_person_emoji.value = ''
}

function handle_emit_fav(id, fav) {
  const person = persons.value.find(i => i.id === id)
  if (person) {
    axios
      .post('/persons/favorite', {
        is_fav: fav,
        id: person.id,
      })
      .then(updatePersons)
      .catch(function (err) {
        console.log(err)
      })
  }
}

function handle_emit_sel(id, sel) {
  const person = persons.value.find(i => i.id === id)
  if (person) {
    person.is_selected = sel
  }
}

function handle_emit_new_ride_added() {
  personDisplay.value.forEach(element => {
    element.reset_selected()
  })
  updatePersons()
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

const persons_sel = computed(() => {
  return persons.value.filter(p => {
    return p.is_selected
  })
})

const sorted_persons = computed(() => {
  return [...persons.value].slice().sort((a, b) => {
    // First, sort by favorite status (favorited items come first)
    if (a.is_fav === b.is_fav) {
      // If both have the same favorite status, sort alphabetically by name
      return a.name.localeCompare(b.name)
    }
    return a.is_fav ? -1 : 1
  })
})

function updatePersons() {
  axios.get('/persons').then(response => {
    persons.value = response.data
    console.log(persons.value)
  })
}

onMounted(() => {
  updatePersons()
})
</script>

<template>
  <div>
    <div
      id="modal-validation"
      :class="{ 'is-active': modal_opened }"
      class="modal"
    >
      <div class="modal-background" @click="toggle_modal"></div>
      <div class="modal-content">
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
            <button class="button is-success" @click="add_person">
              Valider
            </button>
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
    <div class="container">
      <RideSelector
        v-model:persons_sel="persons_sel"
        v-model:price_per_km="price_per_km"
        @new_ride_added="handle_emit_new_ride_added"
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
              ref="personDisplay"
              :name="p.name"
              :emoji="p.emoji"
              :money="p.money"
              :is_fav="p.is_fav"
              :id="p.id"
              @sel-updated="handle_emit_sel"
              @fav-updated="handle_emit_fav"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
