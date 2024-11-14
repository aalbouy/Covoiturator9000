<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const rides = ref([])

const selRideId = ref(-1)
const selRideDate = ref('')
const selRidePersons = ref('')
const selRidePrice = ref(0)

const modal_delete_opened = ref(false)

function updateRides() {
  axios.get('/rides/complete').then(response => {
    rides.value = []
    let raw = [...response.data]
    raw.forEach(r => {
        let ride = rides.value.find(i => i.id === r.ride_id)
        if (ride) {
            ride.persons.push({ name: r.pers_name, id: r.pers_id})
        } else {
            rides.value.push({
                date: r.date,
                persons: [{ name: r.pers_name, id: r.pers_id}],
                id: r.ride_id,
                price: r.price,
                preset: r.preset,
            })
        }
    })
  })
}

function rideDeleteReq(id) {
  let r = rides.value.find(r => r.id === id)
  selRideId.value = id
  selRideDate.value = new Date(Date.parse(r.date)).toLocaleString()
  selRidePrice.value = r.price
  selRidePersons.value = r.persons.map(p => p.name).join(' / ')
  modal_delete_opened.value = true
}

async function rideDeleteValidated() {
  await axios
    .post('/rides/delete', {
      id: selRideId.value,
    })
    .catch(function (err) {
      console.log(err)
    })
    modal_delete_opened.value = false
  updateRides()
}

onMounted(() => {
  updateRides()
})
</script>

<template>
  <div>
    <div
        class="modal"
        ref="deleteModal"
        :class="{ 'is-active': modal_delete_opened }"
      >
        <div class="modal-background" @click="modal_delete_opened = false"></div>
        <div class="modal-content">
          <div class="box">
            <p class="is-size-5 has-text-centered mb-0">
              Confirmer la suppression du trajet du {{ selRideDate }} ?
            </p>
            <p class="is-size-6 has-text-centered">
              ({{ selRidePrice.toFixed(2) }}€ pour {{ selRidePersons }})
            </p>
            <div class="buttons is-centered mb-4">
              <button class="button is-success" @click="rideDeleteValidated">
                Valider
              </button>
              <button class="button is-danger" @click="modal_delete_opened = false">
                Annuler
              </button>
            </div>
          </div>
        </div>
        <button
          class="modal-close is-large"
          aria-label="close"
          @click="modal_delete_opened = false"
        ></button>
      </div>

    <table class="table has-text-centered is-striped is-fullwidth">
      <thead>
        <tr>
          <th>Date</th>
          <th>Preset</th>
          <th>Personnes</th>
          <th>Prix</th>
          <th class="is-narrow">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in rides" :key="p.id">
          <td>{{ new Date(Date.parse(p.date)).toLocaleString() }}</td>
          <td>{{ p.preset ? p.preset : 'N/A' }}</td>
          <td>{{ p.persons.map(p => p.name).join(' - ') }}</td>
          <td>{{ p.price.toFixed(2) }}€</td>
          <td>
              <button
                class="button is-danger is-small"
                @click="rideDeleteReq(p.id)"
              >
                <span class="icon is-small">
                  <i class="mdi mdi-24px mdi-window-close" />
                </span>
              </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
