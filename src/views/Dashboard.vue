<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="col-xl-12 order-xl-1">
                <card shadow type="secondary">
                    <div slot="header" class="bg-white border-0">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <h3 class="mb-0">Özel Ankara Zafer Koleji Online Gelişim İzleme Sistemine Hoşgeldiniz {{$store.getters.getUser.fullname}}</h3>
                            </div>
                        </div>
                    </div>

                </card>
            </div>
            </base-header>

        <!--Charts-->
        <div class="container-fluid mt--7">

            <!-- End charts-->

            <!--Tables-->
            <div class="row mt-5">
                <div class="col-xl-8 mb-5 mb-xl-0">

                </div>
            </div>
            <!--End tables-->
        </div>

    </div>
</template>
<script>
  // Charts


  // Tables
  import SocialTrafficTable from './Dashboard/SocialTrafficTable';
  import PageVisitsTable from './Dashboard/PageVisitsTable';

  export default {
    components: {
      PageVisitsTable,
      SocialTrafficTable,
    },
    data() {
      return {


      };
    },
    methods: {

    },
    mounted() {

    }
  };
</script>
<style></style>
