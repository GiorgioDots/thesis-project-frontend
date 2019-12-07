<template> 
    <div class='container-fluid p-3'>
        <div class="col col-md-auto">
            <div class="shadow p-3 mb-5 bg-white rounded">
                <SignUpForm @onSubmit='onSubmit'></SignUpForm>
            </div>
        </div>
    </div>
</template>

<script>
import SignUpForm from '@/components/Auth/SignUpForm.vue';
export default {
    components: {
        SignUpForm
    },
    methods:{
        onSubmit(form){
            // console.log(form);
            this.$store.dispatch('onSignUp', form).then(() => {
                this.$router.push('/dashboard');
            });
        }
    }
}
</script>