<script setup>
import { ref } from 'vue'
import axios from 'axios'
import MainPage from './components/main-page.vue'
import SettingsPage from './components/settings-page.vue'

const currentPage = ref('main')

function changePage(page) {
  currentPage.value = page
}

function testReq() {
  axios
    .get('http://localhost:3000/api/rides')
    .then(response => console.log(response))
}
</script>

<template>
  <div class="content">
    <!-- Page Content -->
    <section class="my-content">
      <div v-if="currentPage === 'main'">
        <MainPage />
      </div>
      <div v-if="currentPage === 'settings'">
        <SettingsPage />
      </div>
    </section>

    <!-- Bottom Navigation -->
    <footer class="my-footer has-background-inherit is-centered">
      <div class="columns buttons has-addons is-centered is-mobile m-0">
        <button
          class="column button is-primary is-half"
          :class="{ 'is-active': currentPage === 'main' }"
          @click="changePage('main')"
        >
          🚗 Trajets
        </button>
        <button
          class="column button is-primary is-half"
          :class="{ 'is-active': currentPage === 'settings' }"
          @click="changePage('settings')"
        >
          ⚙️ Config.
        </button>
        <!-- <button class="column button is-primary is-third" @click="testReq">
          test req
        </button> -->
      </div>
    </footer>
  </div>
</template>
