<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">

            <div class="col-xl-12 order-xl-1">
                <card shadow type="secondary">
                    <div slot="header" class="bg-white border-0">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <h3 class="mb-0">Personel Ekle</h3>
                            </div>
                        </div>
                    </div>
                    <template>
                        <form @submit.prevent>
                            <h6 class="heading-small text-muted mb-4">Personel Bilgileri</h6>
                            <div class="pl-lg-4">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <base-input alternative=""
                                                    label="Adı"
                                                    placeholder="Adı"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.username"
                                        />
                                    </div>
                                    <div class="col-lg-6">
                                        <base-input alternative=""
                                                    label="Soyadı"
                                                    placeholder="Soyadı"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.usersurname"
                                        />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <base-input alternative=""
                                                    label="Email Adresi"
                                                    placeholder="Email Adresi"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.email"
                                        />
                                    </div>
                                    <div class="col-lg-6">
                                        <base-input alternative=""
                                                    label="TC"
                                                    placeholder="TC"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.tc"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">

                                    <base-button outline type="success" class="float-right" v-if="!updatedMode"
                                                 @click="formValidate">Ekle
                                    </base-button>
                                    <base-button outline type="danger" class="float-right ml-2" v-if="updatedMode"
                                                 @click="onCancelUpdate">Vazgeç
                                    </base-button>
                                    <base-button outline type="warning" class="float-right" v-if="updatedMode"
                                                 @click="updateUser">Güncelle
                                    </base-button>

                                </div>
                            </div>

                        </form>
                    </template>
                </card>
            </div>
        </base-header>
        <div class="container-fluid mt--7">
            <card>
                <slot name="header">
                    <p>Personel Listesi</p>
                </slot>
                <div class="row">
                    <div class="col">
                        <vuetable
                                ref="vuetable"
                                :append-params="moreParams"
                                :fields="$store.getters.getPersonsHeader"
                                :http-fetch="onFetchApi"
                                noDataTemplate="Veri Yok"
                                pagination-path
                                :per-page="10"
                                @vuetable:load-success="onSuccess"
                                @vuetable:load-error="onError"
                                @vuetable:pagination-data="onPaginationData"
                                @vuetable:loading="onLoading"
                                @vuetable:loaded="onLoaded"
                        >
                            <template slot="actions" scope="props">
                                <div class="custom-actions">
                                    <base-button outline type="danger" size="sm" @click="onDeleteStudent(props)">Sil
                                    </base-button>
                                    <base-button outline type="warning" size="sm" @click="onUpdate(props)">Düzenle
                                    </base-button>
                                </div>
                            </template>
                        </vuetable>
                        <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
                        <div class="dataTables_paginate paging_simple_numbers float-right">
                            <vuetable-pagination-bootstrap
                                    class="float-right"
                                    ref="pagination"
                                    @vuetable-pagination:change-page="onChangePage"
                            ></vuetable-pagination-bootstrap>
                        </div>
                    </div>
                </div>
            </card>

        </div>
    </div>
</template>

<script>
    import Loading from "@/components/Loading";
    import Multiselect from "vue-multiselect"
    import appPlugin from "../plugins/appPlugin";
    import Vuetable from 'vuetable-2/src/components/Vuetable'
    import VuetablePaginationBootstrap from '@/components/datatable/VuetablePaginationBootstrap'
    import VuetablePaginationInfo from '@/components/datatable/VuetablePaginationInfo'
    import Swal from "sweetalert2"
    import md5 from "md5"

    export default {
        components: {
            Loading,
            Multiselect,
            Vuetable,
            VuetablePaginationBootstrap,
            VuetablePaginationInfo
        },
        data() {
            return {
                moreParams: {},
                updatedMode: false,
                loading: false,
                model: {
                    username: '',
                    usersurname: "",
                    fullname: "",
                    schoolid: "",
                    cbid: "",
                    tc: "",
                    schoolno: "",
                    email: '',
                }
            }
        },
        methods: {
            onCancelUpdate() {
                this.updatedMode = false
                this.model = {
                    userid: "",
                    username: '',
                    usersurname: "",
                    fullname: "",
                    schoolid: "",
                    cbid: "",
                    tc: "",
                    schoolno: "",
                    email: '',
                }
            },
            onUpdate(row) {
                
                this.updatedMode = true
                this.model.userid = row.rowData.id
                this.model.username = row.rowData.name
                this.model.usersurname = row.rowData.surname
                this.model.tc = row.rowData.tc
                this.model.schoolno = ""
                this.model.email = row.rowData.email
                this.model.schoolid = ""
            },
            updateUser() {
                if (this.model.username.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Personel Adı Giriniz", "warning", "Tamam")
                } else if (this.model.usersurname.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Personel SoyAdı Giriniz", "warning", "Tamam")
                } else if (!appPlugin.validateemail(this.model.email)) {
                    appPlugin.showalert("Uyarı", "Lütfen Geçerli Bir Email Adresi Giriniz", "warning", "Tamam")
                } else if (!appPlugin.checktc(this.model.tc.trim())) {
                    appPlugin.showalert("Uyarı", "Lütfen Geçerli Bir TC No  Giriniz", "warning", "Tamam")
                } else {
                    this.$store.dispatch("updatePersons", {
                        id: this.model.userid,
                        name: this.model.username,
                        surname: this.model.usersurname,
                        tc: this.model.tc,
                        schoolno: "",
                        status: 1, //status
                        type: 1, //öğrenci
                        email: this.model.email,
                    }).then((res) => {
                        if (res.status == 200) {
                            this.onReset()
                            this.$refs.vuetable.reload()
                            appPlugin.showalert("Bilgilendirme", "Personel Başarıyla Güncellendi", "success", "Tamam")
                        } else if (res.status === 204) {
                            appPlugin.showalert("Uyarı", "Tc Numarası,Email Adresi veya Okul Numarasına Sahip Bir Öğrenci Sistemde Kayıtlı", "warning", "Tamam")

                        }
                    }).catch((err) => {
                        appPlugin.showalert("Uyarı", "Personel Güncelleme İşlemi Sırasında Hata Gerçekleşti", "error", "Tamam")
                    })
                }
            },
            onChangePage(page) {
                this.$refs.vuetable.changePage(page)
            },
            onPaginationData(paginationData) {
                this.$refs.pagination.setPaginationData(paginationData)
                this.$refs.paginationInfo.setPaginationData(paginationData)
            },
            onLoading() {
                this.loading = true
            },
            onSuccess() {

            },
            onLoaded() {
                this.loading = false
            },
            onDeleteStudent(row) {
                Swal.fire({
                    title: "Uyarı",
                    text: row.rowData.fullname + " " + "Kaydını Silmek İstediğinize Emin Misiniz ? Bu İşlem Geri Alınamaz",
                    confirmButtonText: "Evet",
                    icon: 'info',
                    confirmButtonColor: 'red',
                    cancelButtonText: "Hayır",
                    showCancelButton: true
                }).then(res => {
                    if (res.value) {
                        this.loading = true
                        this.$store
                            .dispatch('deletePersons', {
                                id: row.rowData.id,
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        this.$refs.vuetable.reload()
                                        appPlugin.showalert("Bilgilendirme", "Personel Silme İşlemi Başarılı", "success", "Tamam")

                                    }
                                } else {
                                    appPlugin.showalert("Uyarı", "Personel Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")

                                }
                                this.loading = false
                            })
                    }
                })
            },
            onError(err) {

                this.loading = false

                alert("hata")
            },
            onFetchApi(apiUrl, httpOptions) {
                return this.$store.dispatch("fetchPersons", {
                    opt: httpOptions
                })
            },
            onReset() {
                this.model = {
                    username: '',
                    usersurname: "",
                    fullname: "",
                    schoolid: "",
                    cbid: "",
                    tc: "",
                    schoolno: "",
                    email: '',
                }
            },
            formValidate() {
                if (this.model.username.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Personel Adı Giriniz", "warning", "Tamam")
                } else if (this.model.usersurname.trim() == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Personel SoyAdı Giriniz", "warning", "Tamam")
                } else if (!appPlugin.validateemail(this.model.email)) {
                    appPlugin.showalert("Uyarı", "Lütfen Geçerli Bir Email Adresi Giriniz", "warning", "Tamam")
                } else if (!appPlugin.checktc(this.model.tc)) {
                    appPlugin.showalert("Uyarı", "Lütfen Geçerli Bir TC No  Giriniz", "warning", "Tamam")
                } else {
                    this.onCreatePerson()
                }
            },
            onCreatePerson() {
                this.loading = true
                this.$store.dispatch("createPersons", {
                    name: this.model.username,
                    surname: this.model.usersurname,
                    tc: this.model.tc,
                    schoolno: "",
                    status: 1, //personel
                    type: 1, //personel
                    email: this.model.email,
                }).then((res) => {
                    if (res.status === 200) {
                        this.onReset()
                        this.$refs.vuetable.reload()
                        appPlugin.showalert("Bilgilendirme", "Personel Başarıyla Eklendi", "success", "Tamam")
                    } else if (res.status === 204) {
                        appPlugin.showalert("Uyarı", "Tc Numarası,Email Adresi veya Okul Numarasına Sahip Bir Personel Sistemde Kayıtlı", "warning", "Tamam")
                    }
                    this.loading = false
                }).catch((err) => {
                    this.loading = false
                    appPlugin.showalert("Uyarı", "Personel Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin", "error", "Tamam")
                })
            },
        },
        created() {
        },
        name: "Persons"
    }
</script>

<style scoped>

</style>