<script setup>
import PersonTable from './settings-page-comp/person-table.vue'
import PresetsTable from './settings-page-comp/presets-table.vue'
import RideTable from './settings-page-comp/rides-tables.vue'
</script>

<template>
  <div class="container pt-6">
    <div class="columns is-mobile">
      <div class="column">
        <div class="title is-1 has-text-centered">Personnes</div>
      </div>
      <div class="column">
        <div class="title is-1 has-text-centered">Presets</div>
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
    <div class="columns">
      <div class="column is-full">
        <div class="title is-1 has-text-centered">
          Trajets
        </div>
      </div>
    </div>
    <RideTable />
  </div>
</template>
