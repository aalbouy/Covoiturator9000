<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const persons = ref([])

const selPersId = ref(-1)

const selPersonName = ref('')
const selPersonEmoji = ref('')

const modal_edit_opened = ref(false)
const modal_refund_opened = ref(false)
const modal_delete_opened = ref(false)

function updatePersons() {
  axios.get('http://localhost:3000/api/persons').then(response => {
    persons.value = [...response.data]
  })
}

function updatePersonVar(id) {
  selPersId.value = id
  selPersonEmoji.value = persons.value.find(i => i.id === selPersId.value).emoji
  selPersonName.value = persons.value.find(i => i.id === selPersId.value).name
}

function personRefundReq(id) {
  updatePersonVar(id)
  modal_refund_opened.value = true
}

function personRefundValidated() {
  axios
    .post('http://localhost:3000/api/persons/refund', {
      id: selPersId.value,
    })
    .then(updatePersons)
    .catch(function (err) {
      console.log(err)
    })

  modal_refund_opened.value = false
}

function personDeleteReq(id) {
  updatePersonVar(id)
  modal_delete_opened.value = true
}

function personDeleteValidated() {
  axios
    .post('http://localhost:3000/api/persons/delete', {
      id: selPersId.value,
    })
    .then(updatePersons)
    .catch(function (err) {
      console.log(err)
    })

  modal_delete_opened.value = false
}

function personEditReq(id) {
  updatePersonVar(id)
  modal_edit_opened.value = true
}

function personEditValidated() {
  axios
    .post('http://localhost:3000/api/persons/update', {
      id: selPersId.value,
      name: selPersonName.value,
      emoji: selPersonEmoji.value,
    })
    .then(updatePersons)
    .catch(function (err) {
      console.log(err)
    })

  modal_edit_opened.value = false
}

onMounted(() => {
  updatePersons()
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
          <p class="is-size-5 has-text-centered mb-4">
            Confirmer la suppression de {{ selPersonName }} ?
          </p>
          <div class="buttons is-centered mb-4">
            <button class="button is-success" @click="personDeleteValidated">
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
      ref="refundModal"
      :class="{ 'is-active': modal_refund_opened }"
    >
      <div class="modal-background" @click="modal_refund_opened = false"></div>
      <div class="modal-content">
        <div class="box">
          <p class="is-size-5 has-text-centered mb-4">
            Confirmer le remboursement de {{ selPersonName }} ?
          </p>
          <div class="buttons is-centered mb-4">
            <button class="button is-success" @click="personRefundValidated">
              Valider
            </button>
            <button class="button is-danger" @click="modal_refund_opened = false">
              Annuler
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="modal_refund_opened = false"
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
            Modifier le profil de {{ selPersonName }}
          </p>
          <div class="field-group has-text-centered">
            <div class="field is-inline-block-desktop">
              <label class="label" for="selPersonNameInput">Nom</label>
              <div class="control" ref="selPersonNameInput">
                <input class="input" type="text" v-model="selPersonName" />
              </div>
            </div>

            <div class="field is-inline-block-desktop">
              <label class="label" for="selPersonEmojiInput">Emoji</label>
              <div class="control" ref="selPersonEmojiInput">
                <input class="input" type="text" v-model="selPersonEmoji" />
              </div>
            </div>
          </div>
          <div class="buttons is-centered mb-4">
            <button class="button is-success" @click="personEditValidated">
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

    <table class="table has-text-centered is-striped is-size-5 is-fullwidth">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Emoji</th>
          <th>Dette</th>
          <th class="is-narrow">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in persons" :key="p.id">
          <td>{{ p.name }}</td>
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
  </div>
</template>
