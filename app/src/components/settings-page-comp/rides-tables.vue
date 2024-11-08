<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const rides = ref([])

function updateRides() {
  axios.get('http://localhost:3000/api/rides/complete').then(response => {
    rides.value = []
    let raw = [...response.data]
    console.log(raw)
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

onMounted(() => {
  updateRides()
  console.log(rides)
})
</script>

<template>
  <table class="table has-text-centered is-striped is-size-5 is-fullwidth">
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
      <tr v-for="p in persons" :key="p.id">
        <td>{{ p.date }}</td>
        <td>{{ p.preset }}</td>
        <td>{{ p.emoji }}</td>
        <td>{{ p.money.toFixed(2) }}€</td>
        <td>
          <div class="field is-grouped">
            <button
              class="button is-small is-info"
              @click="personRefundReq(p.id)"
            >
              <span class="icon is-large">
                <i class="mdi mdi-24px mdi-cash-refund" />
              </span>
            </button>
            <button class="button is-small" @click="personEditReq(p.id)">
              <span class="icon is-small">
                <i class="mdi mdi-24px mdi-pencil" />
              </span>
            </button>
            <button
              class="button is-danger is-small"
              @click="personDeleteReq(p.id)"
            >
              <span class="icon is-small">
                <i class="mdi mdi-24px mdi-window-close" />
              </span>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
