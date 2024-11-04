<script setup>
import { ref } from 'vue'

const curr_price = ref(0)
const val_modal_opened = ref(false)

const new_ride_modal_opened = ref(false)
const km_mode = ref(false)
const new_ride_price = ref(0)
const new_ride_name = ref('')

const props = defineProps({
  rides: Array,
  nb_persons: Number,
  price_per_km: Number,
})

function ride_clicked(id) {
  const ride = props.rides.find(i => i.id === id)
  if (ride) {
    curr_price.value = ride.price
  }
}

function toggle_val_modal() {
  if (curr_price.value <= 0) {
    return
  }

  val_modal_opened.value = !val_modal_opened.value
}

function toggle_new_ride_modal() {
  new_ride_modal_opened.value = !new_ride_modal_opened.value
}

function new_ride_validated() {
  if (new_ride_price.value > 0 && new_ride_name.value.length === 0) {
    return
  }

  if (km_mode.value) {
    new_ride_price.value = props.price_per_km * new_ride_price.value
  }

  emits('new-ride', new_ride_name.value, new_ride_price.value)

  new_ride_price.value = 0
  new_ride_name.value = ''

  toggle_new_ride_modal()
}

function ride_validated() {}

const emits = defineEmits(['new-ride'])
</script>

<template>
  <!-- Start of new ride modal -->
  <div class="modal" :class="{ 'is-active': new_ride_modal_opened }">
    <div class="modal-background" @click="toggle_new_ride_modal"></div>
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
              <input class="input" type="number" v-model="new_ride_price" />
            </div>
          </div>

          <div class="field is-inline-block-desktop">
            <label class="label">Nom</label>
            <div class="control">
              <input class="input" type="text" v-model="new_ride_name" />
            </div>
          </div>
        </div>
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
  <!-- End of new ride modal -->

  <!-- Start of validation modal -->
  <div class="modal" :class="{ 'is-active': val_modal_opened }">
    <div class="modal-background" @click="toggle_val_modal"></div>
    <div class="modal-content">
      <div class="box">
        <p class="is-size-5 has-text-centered mb-4">
          Valider le trajet pour {{ props.nb_persons + 1 }} personnes ?
        </p>
        <div class="buttons is-centered mb-4">
          <button class="button is-success" @click="ride_validated">
            Valider
          </button>
          <button class="button is-danger" @click="toggle_val_modal">
            Annuler
          </button>
        </div>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="toggle_val_modal"
    ></button>
  </div>
  <!-- End of validation modal -->
  <div class="columns">
    <div class="column is-full is-size-2 has-text-centered">
      Trajet : {{ curr_price.toFixed(2) }} €
    </div>
  </div>
  <div class="columns">
    <div class="column is-full has-text-centered">
      <button class="button is-info" @click="toggle_val_modal">Valider</button>
    </div>
  </div>
  <div class="columns">
    <div class="column p-0">
      <div class="columns is-1 is-mobile horizontal-scrollbar hide-scrollbar">
        <div v-for="p in props.rides" :key="p.id">
          <div class="column is-narrow" @click="ride_clicked(p.id)">
            <p class="tag is-dark">{{ p.name }} - {{ p.price }}€</p>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-narrow p-0">
      <button
        class="tag button is-outlined is-info"
        @click="toggle_new_ride_modal"
      >
        Ajouter trajet
      </button>
    </div>
  </div>
</template>
