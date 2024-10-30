<script setup>
import { ref } from 'vue'
import Person from './components/person-item.vue'

const persons = ref([])
const new_person_name = ref('')
const id_person = ref('')

function add_person() {
  persons.value.push({
    id: id_person.value++,
    name: new_person_name.value,
    money_due: 0.0,
    is_fav: false,
    force: 0,
  })

  persons.value.forEach(p => {
    p.force++
  })
}
</script>

<template>
  <div class="field is-grouped">
    <p class="control is-expanded">
      <input
        class="input"
        type="text"
        placeholder="Nom"
        v-model="new_person_name"
      />
    </p>
    <p class="control">
      <button @click="add_person" class="button is-info">Ajouter</button>
    </p>
  </div>
  <div class="fixed-grid">
    <div class="grid">
      <div v-for="p in persons" :key="p.id">
        <Person :name="p.name" :money_due="p.money_due" :is_fav="p.is_fav" />
      </div>
    </div>
  </div>
</template>
