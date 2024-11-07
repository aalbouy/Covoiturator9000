<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const presets = ref([])

const curr_price = ref(0.0)

const custom_price_modal_opened = ref(false)
const custom_price = ref(0)

const new_ride_modal_opened = ref(false)

const new_preset_modal_opened = ref(false)
const km_mode = ref(false)
const new_preset_price = ref(0)
const new_preset_name = ref('')

const cur_preset_id = ref(-1)

const props = defineProps({
  persons_sel: Array,
  price_per_km: Number,
})

const sel_persons_name = computed(() => {
  return props.persons_sel.map(person => person.name).join(' / ')
})

function preset_clicked(id) {
  const preset = presets.value.find(i => i.id === id)
  if (preset) {
    curr_price.value = preset.price
    cur_preset_id.value = preset.id
  }
}

function toggle_new_ride_modal() {
  if (curr_price.value <= 0) {
    return
  }

  new_ride_modal_opened.value = !new_ride_modal_opened.value
}

function toggle_new_preset_modal() {
  new_preset_modal_opened.value = !new_preset_modal_opened.value
}

function toggle_custom_price_modal() {
  custom_price_modal_opened.value = !custom_price_modal_opened.value
}

function custom_price_validated() {
  curr_price.value = custom_price.value
  custom_price.value = 0
  cur_preset_id.value = -1
  toggle_custom_price_modal()
}

function new_preset_validated() {
  if (new_preset_price.value > 0 && new_preset_name.value.length === 0) {
    return
  }

  if (km_mode.value) {
    new_preset_price.value = props.price_per_km * new_preset_price.value
  }

  axios
    .post('http://localhost:3000/api/presets', {
      price: new_preset_price.value,
      name: new_preset_name.value,
    })
    .then(updatePresets)
    .catch(function (err) {
      console.log(err)
    })

  toggle_new_preset_modal()

  new_preset_price.value = 0
  new_preset_name.value = ''
}

async function new_ride_validated() {
  if (curr_price.value <= 0) {
    return
  }

  let persons_id = props.persons_sel.map(person => person.id)

  await axios
    .post('http://localhost:3000/api/rides', {
      persons_id: persons_id,
      price: curr_price.value,
      preset_id: cur_preset_id.value,
    })
    .catch(function (err) {
      console.log(err)
    })

  toggle_new_ride_modal()

  curr_price.value = 0
  cur_preset_id.value = 0

  emits('new_ride_added')
}

function updatePresets() {
  axios.get('http://localhost:3000/api/presets').then(response => {
    presets.value = response.data
  })
}

onMounted(() => {
  updatePresets()
})

const emits = defineEmits(['new_ride_added'])
</script>

<template>
  <div>
    <!-- Start of ride price modal -->
    <div class="modal" :class="{ 'is-active': custom_price_modal_opened }">
      <div class="modal-background" @click="toggle_custom_price_modal"></div>
      <div class="modal-content">
        <div class="box">
          <input
            class="input is-large is-info mb-4"
            type="number"
            step="0.01"
            v-model="custom_price"
          />
          <div class="buttons is-centered mb-4">
            <button class="button is-success" @click="custom_price_validated">
              Valider
            </button>
            <button class="button is-danger" @click="toggle_custom_price_modal">
              Annuler
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="toggle_custom_price_modal"
      ></button>
    </div>
    <!-- End of ride price modal -->

    <!-- Start of new preset modal -->
    <div class="modal" :class="{ 'is-active': new_preset_modal_opened }">
      <div class="modal-background" @click="toggle_new_preset_modal"></div>
      <div class="modal-content">
        <div class="box">
          <p class="is-size-5 has-text-centered mb-4">
            Ajout d'un nouveau trajet
          </p>
          <div class="field-group has-text-centered">
            <div class="field">
              <input
                id="switch_km_euros"
                type="checkbox"
                name="switch_km_euros"
                class="switch is-rounded is-info"
                v-model="km_mode"
              />
              <label for="switch_km_euros">Mode km</label>
            </div>
            <div class="field is-inline-block-desktop">
              <label class="label">{{
                km_mode ? 'Nombre de km' : 'Prix du trajet'
              }}</label>
              <div class="control">
                <input class="input" type="number" v-model="new_preset_price" />
              </div>
            </div>

            <div class="field is-inline-block-desktop">
              <label class="label">Nom</label>
              <div class="control">
                <input class="input" type="text" v-model="new_preset_name" />
              </div>
            </div>
          </div>
          <div class="buttons is-centered mb-4">
            <button class="button is-success" @click="new_preset_validated">
              Valider
            </button>
            <button class="button is-danger" @click="toggle_new_preset_modal">
              Annuler
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="toggle_new_preset_modal"
      ></button>
    </div>
    <!-- End of new preset modal -->

    <!-- Start of ride validation modal -->
    <div class="modal" :class="{ 'is-active': new_ride_modal_opened }">
      <div class="modal-background" @click="toggle_new_ride_modal"></div>
      <div class="modal-content">
        <div class="box">
          <p class="is-size-5 has-text-centered mb-4">
            Valider le trajet pour {{ props.persons_sel.length }} personnes ? ({{
              sel_persons_name
            }})
          </p>
          <p class="has-text-centered mb-4">
            Cela reviendra à
            {{ Math.round((curr_price / (props.persons_sel.length + 1)) * 100) / 100 }} € par
            personne
          </p>
          <div class="buttons is-centered mb-4">
            <button class="button is-success" @click="new_ride_validated">
              Valider
            </button>
            <button class="button is-danger" @click="toggle_new_ride_modal">
              Annuler
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="toggle_new_ride_modal"
      ></button>
    </div>
    <!-- End of validation modal -->

    <div class="columns is-centered">
      <div
        class="column is-size-2 is-narrow is-centered has-text-centered mt-4"
        @click="toggle_custom_price_modal"
      >
        Trajet : {{ curr_price.toFixed(2) }} €
      </div>
    </div>
    <div class="columns">
      <div class="column is-full has-text-centered">
        <button class="button is-info" @click="toggle_new_ride_modal">
          Valider
        </button>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column m-0">
        <div class="columns is-1 is-mobile horizontal-scrollbar hide-scrollbar">
          <div v-for="p in presets" :key="p.id">
            <div class="column is-narrow" @click="preset_clicked(p.id)">
              <p class="tag is-dark">{{ p.name }} - {{ p.price }}€</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-narrow m-0">
        <button
          class="tag button is-outlined is-info"
          @click="toggle_new_preset_modal"
        >
          Ajouter trajet
        </button>
      </div>
    </div>
  </div>
</template>
