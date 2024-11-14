<script setup>
import PersonTable from './settings-page-comp/person-table.vue'
import PresetsTable from './settings-page-comp/presets-table.vue'
import RideTable from './settings-page-comp/rides-tables.vue'
</script>

<template>
  <div class="container pt-6">
    <div class="columns">
      <div class="column is-full">
        <div class="title is-1 has-text-centered">Personnes</div>
      </div>
      <div class="column is-full">
        <PersonTable />
      </div>
      <div class="column is-full">
        <div class="title is-1 has-text-centered">Presets</div>
      </div>
      <div class="column is-full">
        <PresetsTable />
      </div>
      <div class="column is-full">
        <div class="title is-1 has-text-centered">
          Trajets
        </div>
      </div>
      <div class="column is-full">
        <RideTable />
      </div>
    </div>
  </div>
</template>
