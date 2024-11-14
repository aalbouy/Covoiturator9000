<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const presets = ref([])

const modal_delete_opened = ref(false)
const modal_edit_opened = ref(false)

const selPresetId = ref(-1)

const selPresetName = ref('')
const selPresetPrice = ref('')

function updatePresets() {
  axios.get('/presets').then(response => {
    presets.value = [...response.data]
  })
}

function updatePresetVar(id) {
  selPresetId.value = id
  selPresetName.value = presets.value.find(i => i.id === id).name
  selPresetPrice.value = presets.value.find(i => i.id === id).price
}

function presetDeletionValidated() {
  axios
    .post('/presets/delete', {
      id: selPresetId.value,
    })
    .then(updatePresets)
    .catch(function (err) {
      console.log(err)
    })

  modal_delete_opened.value = false
}

function presetEditReq(id) {
  updatePresetVar(id)
  modal_edit_opened.value = true
}

function presetEditValidated() {
  axios
    .post('/presets/update', {
      id: selPresetId.value,
      name: selPresetName.value,
      price: selPresetPrice.value,
    })
    .then(updatePresets)
    .catch(function (err) {
      console.log(err)
    })

  modal_edit_opened.value = false
}

function presetDeleteReq(id) {
  updatePresetVar(id)
  modal_delete_opened.value = true
}

onMounted(() => {
  updatePresets()
})
</script>

<template>
  <div
    class="modal"
    ref="deleteModal"
    :class="{ 'is-active': modal_delete_opened }"
  >
    <div class="modal-background" @click="modal_delete_opened = false"></div>
    <div class="modal-content">
      <div class="box">
        <p class="is-size-5 has-text-centered mb-4">
          Confirmer la suppression de « {{ selPresetName }} » ?
        </p>
        <div class="buttons is-centered mb-4">
          <button class="button is-success" @click="presetDeletionValidated">
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

  <div
    class="modal"
    ref="editModal"
    :class="{ 'is-active': modal_edit_opened }"
  >
    <div class="modal-background" @click="modal_edit_opened = false"></div>
    <div class="modal-content">
      <div class="box">
        <p class="is-size-5 has-text-centered mb-4">
          Modifier le preset « {{ selPresetName }} »
        </p>
        <div class="field-group has-text-centered">
          <div class="field is-inline-block-desktop">
            <label class="label" for="selPersonNameInput">Nom</label>
            <div class="control" ref="selPersonNameInput">
              <input class="input" type="text" v-model="selPresetName" />
            </div>
          </div>

          <div class="field is-inline-block-desktop">
            <label class="label" for="selPersonEmojiInput">Prix</label>
            <div class="control" ref="selPersonEmojiInput">
              <input class="input" type="text" v-model="selPresetPrice" />
            </div>
          </div>
        </div>
        <div class="buttons is-centered mb-4">
          <button class="button is-success" @click="presetEditValidated">
            Valider
          </button>
          <button class="button is-danger" @click="modal_edit_opened = false">
            Annuler
          </button>
        </div>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="modal_edit_opened = false"
    ></button>
  </div>
  
  <table class="table has-text-centered is-striped is-fullwidth">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Montant</th>
        <th class="is-narrow">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in presets" :key="p.id">
        <td>{{ p.name }}</td>
        <td>{{ p.price.toFixed(2) }}€</td>
        <td>
          <div class="field is-grouped">
            <button class="button is-small" @click="presetEditReq(p.id)">
              <span class="icon is-small">
                <i class="mdi mdi-24px mdi-pencil" />
              </span>
            </button>
            <button
              class="button is-danger is-small"
              @click="presetDeleteReq(p.id)"
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
