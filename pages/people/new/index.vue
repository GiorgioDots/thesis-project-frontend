<template>
  <div class="container-fluid p-3">
    <div class="col col-md-auto">
      <div class="shadow p-3 mb-5 bg-white rounded">
        <NewPersonForm @onSubmit="onSubmit"></NewPersonForm>
      </div>
    </div>
  </div>
</template>
<script>
import NewPersonForm from "@/components/People/NewPersonForm.vue";
export default {
  components: {
    NewPersonForm
  },
  methods: {
    onSubmit(formInfo) {
      this.$store.dispatch("addPerson", formInfo);
      this.$router.push("/people");
    }
  }
};
</script>