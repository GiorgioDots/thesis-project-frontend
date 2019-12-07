<template>
    <div class='container-fluid p-3'>
        <div class="col col-md-auto">
            <div class="shadow p-3 mb-5 bg-white rounded">
                <LoginForm @onSubmit='onSubmit'></LoginForm>
                <br>
                <b-alert show variant="warning" v-if="wrongAuth">Wrong email or password</b-alert>
            </div>
        </div>
    </div>
</template>

<script>
import LoginForm from '@/components/Auth/LoginForm.vue';
export default {
    components: {
        LoginForm
    },
    data(){
        return {
            wrongAuth: false
        } 
    },
    methods:{
        onSubmit(form){
            // console.log(form);
            this.$store.dispatch('onLogin', form).then((done) => {
                if(done){
                    this.wrongAuth = true
                    setInterval(() => {
                        this.wrongAuth = false
                    },3000)
                }else{
                    this.$router.push('/dashboard');
                }
            });
        }
    }
}
</script>