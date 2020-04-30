<template>
  <div class="row justify-content-center">
    <Loading v-if="loading" />

    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-header bg-transparent pb-5">
          <div class="text-muted text-center mt-2 mb-3">
            <template>
              <div class="btn-wrapper text-center">
                <img
                        src="https://media-exp1.licdn.com/dms/image/C4D0BAQELywGwSW-f0w/company-logo_200_200/0?e=2159024400&v=beta&t=2guRK4Ucejr3slw04dFkTKybYJh3q_QB4IXO1TJGriI"
                        class="rounded-circle"
                />
              </div>
            </template>
            <strong>Zafer Giriş</strong>
          </div>
        </div>
        <div class="card-body px-lg-5 py-lg-5">
          <form role="form">
            <base-input
                    class="input-group-alternative mb-3"
                    placeholder="TC"
                    addon-left-icon="fa fa-user"
                    v-model="model.tc"
            ></base-input>

            <base-input
                    class="input-group-alternative"
                    placeholder="Parola"
                    type="password"
                    addon-left-icon="ni ni-lock-circle-open"
                    v-model="model.password"
            ></base-input>
            <div class="text-center">
              <base-button type="primary" class="my-4" @click="loginControl">Giriş Yap</base-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import appPlugin from "@/plugins/appPlugin";
  import Loading from "@/components/Loading";

  export default {
    name: "login",
    components: {
      Loading
    },
    methods: {
      loginControl() {
        if (!appPlugin.checktc(this.model.tc.trim())) {
          appPlugin.showalert(
                  "Uyarı",
                  "Lütfen Geçerli Bir Tc Numarası Giriniz",
                  "info",
                  "Tamam"
          );
        } else if (this.model.password.length < 5) {
          appPlugin.showalert(
                  "Uyarı",
                  "Lütfen Parolanızı Kontrol Edin",
                  "info",
                  "Tamam"
          );
        } else {
          this.onLogin();
        }
      },
      onLogin() {
        this.loading = true;
        this.$store
                .dispatch("login", {
                  tc: this.model.tc,
                  password: this.model.password
                })
                .then(res => {
                  debugger;
                  if (res.status == 204) {
                    appPlugin.showalert(
                            "Uyarı",
                            "Kullanıcı Adı Veya Parola Yanlış",
                            "error",
                            "Tamam"
                    );
                  } else if (res.status == 200) {
                    this.$router.replace("/dashboard");
                  }
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                  appPlugin.showalert(
                          "Uyarı",
                          "Giriş İşlemi Yapılamadı Lütfen Daha Sonra Tekrar Dene",
                          "error",
                          "Tamam"
                  );
                });
      }
    },
    data() {
      return {
        loading: false,
        model: {
          tc: "",
          password: ""
        }
      };
    }
  };
</script>
<style></style>