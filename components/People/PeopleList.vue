<template>
  <b-card-group deck>
    <div v-for="(person, index) in people" :key="person.name">
      <b-card
        :title="person.name"
        :img-src="person.photo"
        :img-alt="person.name"
        img-top
        style="max-width: 200rem;"
        class="mb-2"
      >
        <b-card-text>{{ person.degree }}</b-card-text>
        <b-button @click="onModify(index)" variant="outline-info">Modify</b-button>
      </b-card>
    </div>
  </b-card-group>
</template>

<script>
export default {
  computed: {
    people() {
      return this.$store.getters.getPeople;
    }
  },
  methods: {
    onModify(index) {
      this.$router.push(`/people/${this.people[index].id}`);
    }
  }
};
</script>
