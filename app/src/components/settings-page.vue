<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PersonTable from './settings-page-comp/person-table.vue'
import PresetsTable from './settings-page-comp/presets-table.vue'
import RideTable from './settings-page-comp/rides-tables.vue'
</script>

<template>
  <div class="container pt-6">
    <div class="columns is-mobile">
      <div class="column">
        <div class="title is-1">Personnes</div>
      </div>
      <div class="column">
        <div class="title is-1">Presets</div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-half">
        <PersonTable />
      </div>
      <div class="column is-half">
        <PresetsTable />
      </div>
    </div>
    <RideTable />
  </div>
</template>
