<template>
    <div>
        <Loading v-if="loading"/>

        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">

            <div class="col-xl-12 order-xl-1">
                <card shadow type="secondary">
                    <div slot="header" class="bg-white border-0">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <h3 class="mb-0">Parola Değiştir </h3>
                            </div>
                        </div>
                    </div>

                </card>
            </div>
        </base-header>
        <div class="container-fluid mt--7">
            <card>
                <div class="row">
                    <div class="col-md-12">
                        <base-input placeholder="Şuanki Parolanız" type="password" v-model="model.oldpass"></base-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <base-input placeholder="Yeni Parola" type="password" v-model="model.newpass"></base-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <base-input placeholder="Yeni Parola Tekrarı" type="password"
                                    v-model="model.newpassagain"></base-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <base-button type="success" class="float-right" @click="passwordControl">Parolamı Değiştir
                        </base-button>
                    </div>
                </div>
            </card>
        </div>
    </div>
</template>

<script>
    import appPlugin from "@/plugins/appPlugin";
    import Loading from "@/components/Loading";

    export default {
        name: "ChangePassword",
        components: {
            Loading
        },
        methods: {
            updatePassword() {
                this.loading = true
                this.$store.dispatch("changePass", {
                    old: this.model.oldpass,
                    new: this.model.newpass,
                    userid: this.$store.getters.getUser.id
                }).then((res) => {
                    this.loading = false
                    if (res.status === 200) {
                        this.onReset()
                        appPlugin.showalert("Bilgilendirme", "Parolanız Değiştirildi", "success", "Tamam")
                    } else if (res.status === 204) {
                        appPlugin.showalert("Uyarı", "Eski Parolanız Yanlış Girildi", "warning", "Tamam")
                    }
                }).catch((err) => {
                    this.loading = false
                    appPlugin.showalert("Uyarı", "Parolanız Değiştirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "info", "Tamam")
                })
            },
            onReset() {
                this.model = {
                    oldpass: "",
                    newpass: "",
                    newpassagain: ""
                }
            },
            passwordControl() {
                if (this.model.oldpass.trim().length < 5) {
                    appPlugin.showalert("Uyarı", "Parolanız En Az 5 Karakter Olmalıdır", "info", "Tamam")
                } else if (this.model.newpass.trim().length < 5) {
                    appPlugin.showalert("Uyarı", "Parolanız En Az 5 Karakter Olmalıdır", "info", "Tamam")
                } else if (this.model.newpassagain.trim().length < 5) {
                    appPlugin.showalert("Uyarı", "Parolanız En Az 5 Karakter Olmalıdır", "info", "Tamam")
                } else if (this.model.newpassagain.trim() != this.model.newpass.trim()) {
                    appPlugin.showalert("Uyarı", "Parolalar Eşleşmiyor", "info", "Tamam")
                } else {
                    this.updatePassword()
                }
            }
        },
        data() {
            return {
                loading: false,
                model: {
                    oldpass: "",
                    newpass: "",
                    newpassagain: ""
                }
            }
        }
    }
</script>

<style scoped>

</style>