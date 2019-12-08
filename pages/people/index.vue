<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col p-3">
        <button @click="onAddPerson" class="btn btn-success">Add new Person</button>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12">
        <PeopleList></PeopleList>
      </div>
    </div>
  </div>
</template>

<script>
import PeopleList from "@/components/People/PeopleList.vue";
export default {
  components: {
    PeopleList
  },
  methods: {
    onAddPerson() {
      this.$router.push("/people/new");
    }
  }
};
</script>