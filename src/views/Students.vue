<template>
    <div>
        <Loading v-if="loading"/>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="col-xl-12 order-xl-1">
                <card shadow type="secondary">
                    <div slot="header" class="bg-white border-0">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <h3 class="mb-0">Öğrenci Ekle</h3>
                            </div>
                        </div>
                    </div>
                    <template>
                        <form @submit.prevent>
                            <h6 class="heading-small text-muted mb-4">Öğrenci Bilgileri</h6>
                            <div class="pl-lg-4">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <base-input
                                                alternative=""
                                                label="Adı"
                                                placeholder="Adı"
                                                input-classes="form-control-alternative"
                                                v-model="model.username"
                                        />
                                    </div>
                                    <div class="col-lg-6">
                                        <base-input
                                                alternative=""
                                                label="Soyadı"
                                                placeholder="Soyadı"
                                                input-classes="form-control-alternative"
                                                v-model="model.usersurname"
                                        />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <base-input
                                                alternative=""
                                                label="Email Adresi"
                                                placeholder="Email Adresi"
                                                input-classes="form-control-alternative"
                                                v-model="model.email"
                                        />
                                    </div>
                                    <div class="col-lg-6">
                                        <base-input
                                                alternative=""
                                                label="TC"
                                                placeholder="TC"
                                                input-classes="form-control-alternative"
                                                v-model="model.tc"
                                        />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <base-input
                                                alternative=""
                                                label="Okul Numarası "
                                                placeholder="Okul Numarası"
                                                input-classes="form-control-alternative"
                                                v-model="model.schoolno"
                                        />
                                    </div>
                                    <div class="col-lg-6">
                                        <label class="form-control-label">Okul Seçiniz</label>
                                        <multiselect
                                                v-model="model.schoolid"
                                                @input="onChangeSchool"
                                                track-by="name"
                                                :allow-empty="false"
                                                label="name"
                                                selectedLabel="Seçili"
                                                selectLabel="Seç"
                                                :hide-selected="false"
                                                :multiple="false"
                                                deselectLabel
                                                :options="$store.getters.getSchools"
                                                :searchable="true"
                                                :close-on-select="true"
                                                :show-labels="true"
                                                placeholder="Okul Seçiniz"
                                        ></multiselect>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <label class="form-control-label"
                                        >Sınıf ve Şube Seçiniz</label
                                        >
                                        <multiselect
                                                v-model="model.cbid"
                                                track-by="fullname"
                                                :allow-empty="false"
                                                label="fullname"
                                                selectedLabel="Seçili"
                                                selectLabel="Seç"
                                                :hide-selected="false"
                                                :multiple="false"
                                                deselectLabel
                                                :options="$store.getters.getSchoolClassBranch"
                                                :searchable="true"
                                                :close-on-select="true"
                                                :show-labels="true"
                                                placeholder="Sınıf ve Şube Seçiniz"
                                        ></multiselect>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <base-button
                                            outline
                                            type="success"
                                            class="float-right"
                                            v-if="!updatedMode"
                                            @click="formValidate"
                                    >Ekle
                                    </base-button>
                                    <base-button
                                            outline
                                            type="danger"
                                            class="float-right ml-2"
                                            v-if="updatedMode"
                                            @click="onCancelUpdate"
                                    >Vazgeç
                                    </base-button>
                                    <base-button
                                            outline
                                            type="warning"
                                            class="float-right"
                                            v-if="updatedMode"
                                            @click="updateUser"
                                    >Güncelle
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
                    <p>Öğrenci Listesi</p>
                </slot>
                <div class="row">
                    <div class="col-md-10">
                        <base-input v-if="!searchClassBranch" alternative
                                    placeholder="TC No,Okul Numarası,Öğrenci Adı Veya Soyadına Göre Ara.."
                                    @input="studentSearch"
                                    v-model="searchtext"></base-input>
                    </div>
                    <div class="col-md-2">
                        <base-button v-if="!searchClassBranch" @click="searchFilter">Ara</base-button>
                    </div>
                    <div class="col-12">
                        <a href="#" @click.prevent="searchClassBranch=!searchClassBranch" v-if="!searchClassBranch">
                            Sınıf Ve Şubeye Göre Arama Yapmak İçin Buraya Tıklayınız
                        </a>
                        <a href="#" class="float-right" @click.prevent="goBack"
                           v-if="searchClassBranch">
                            Geri Dön
                        </a>
                        <div class="form-group" v-if="searchClassBranch">
                            <label for="exampleFormControlSelect1">Sınıf Seçiniz</label>
                            {{selectedClass}}
                            <select class="form-control" id="exampleFormControlSelect1" v-model="selectedClass">
                                <option selected disabled>Sınıf Seçiniz</option>
                                <option v-for="item in $store.getters.getClases" v-bind:value="item.id">{{item.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group" v-if="searchClassBranch">
                            <label for="exampleFormControlSelect2">Şube Seçiniz</label>
                            {{selectedBranch}}
                            <select class="form-control" id="exampleFormControlSelect2" v-model="selectedBranch">
                                <option selected disabled>Şube Seçiniz</option>
                                <option v-for="item in $store.getters.getBranches" v-bind:value="item.id">
                                    {{item.name}}
                                </option>
                            </select>
                        </div>
                        <base-button v-if="searchClassBranch" @click="searchCB">Ara</base-button>
                    </div>
                    <br/>
                    <div class=" col mt-5
                        ">
                        <vuetable
                                class="table-responsive"
                                ref="vuetable"
                                :append-params="moreParams"
                                :fields="$store.getters.getStudentHeader"
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
                                    <base-button
                                            outline
                                            type="danger"
                                            size="sm"
                                            @click="onDeleteStudent(props)"
                                    >Sil
                                    </base-button>
                                    <base-button
                                            outline
                                            type="warning"
                                            size="sm"
                                            @click="onUpdate(props)"
                                    >Düzenle
                                    </base-button>
                                </div>
                            </template>
                        </vuetable>
                        <vuetable-pagination-info
                                ref="paginationInfo"
                        ></vuetable-pagination-info>
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
    import Multiselect from "vue-multiselect";
    import appPlugin from "../plugins/appPlugin";
    import Vuetable from "vuetable-2/src/components/Vuetable";
    import VuetablePaginationBootstrap from "@/components/datatable/VuetablePaginationBootstrap";
    import VuetablePaginationInfo from "@/components/datatable/VuetablePaginationInfo";
    import Swal from "sweetalert2";
    import Options from "./Options";

    export default {
        components: {
            Options,
            Loading,
            Multiselect,
            Vuetable,
            VuetablePaginationBootstrap,
            VuetablePaginationInfo
        },
        data() {
            return {
                selectedClass: "",
                selectedBranch: "",

                searchClassBranch: false,
                moreParams: {},
                updatedMode: false,
                loading: false,
                searchtext: "",
                model: {
                    username: "",
                    usersurname: "",
                    fullname: "",
                    schoolid: "",
                    cbid: "",
                    tc: "",
                    schoolno: "",
                    email: ""
                }
            };
        },
        methods: {
            goBack() {
                this.searchClassBranch = !this.searchClassBranch
                this.selectedClass = ""
                this.selectedBranch = ""
                this.$nextTick(function () {
                    this.$refs.vuetable.refresh()
                })
            },
            searchCB() {
                if (this.selectedClass == "") {
                    appPlugin.showalert("Uyarı", "Sınıf Seçimi Yapınız", "info", "Tamam")
                } else if (this.selectedBranch == "") {
                    appPlugin.showalert("Uyarı", "Şube Seçimi Yapınız", "info", "Tamam")
                } else {
                    this.$nextTick(function () {
                        this.$refs.vuetable.refresh()
                    })
                }

            },
            searchFilter() {
                this.$nextTick(function () {
                    this.$refs.vuetable.refresh()
                })
            },
            onCancelUpdate() {
                this.updatedMode = false;
                this.model = {
                    userid: "",
                    username: "",
                    usersurname: "",
                    fullname: "",
                    schoolid: "",
                    cbid: "",
                    tc: "",
                    schoolno: "",
                    email: ""
                };
            },
            onUpdate(row) {
                /*
                *
                *  { "schoolid": 2, "classid": 11, "branchid": 1, "schoolname": "Özel Zafer Fen Lisesi", "branchname": "A", "classname": "11. Sınıf", "fullname": "11. Sınıf A" }
                * */
                this.updatedMode = true;
                this.model.userid = row.rowData.id;
                this.model.username = row.rowData.name;
                this.model.usersurname = row.rowData.surname;
                this.model.tc = row.rowData.tc;
                this.model.schoolno = row.rowData.schoolNo;
                this.model.email = row.rowData.email;
                this.model.schoolid = row.rowData.school;
                this.onChangeSchool(row.rowData.school);
                this.model.cbid = {
                    id: row.rowData.school.id,
                    name: row.rowData.school.name,
                    code: row.rowData.school.code,
                    branchid: row.rowData.branch.id,
                    branchname: row.rowData.branch.name,
                    branchcode: row.rowData.branch.code,
                    classid: row.rowData.class.id,
                    classname: row.rowData.class.name,
                    classcode: row.rowData.class.code,
                    fullname: row.rowData.class.name + " " + row.rowData.branch.name
                };
            },
            updateUser() {
                if (this.model.username.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Öğrenci Adı Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (this.model.usersurname.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Öğrenci SoyAdı Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (!appPlugin.validateemail(this.model.email)) {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Geçerli Bir Email Adresi Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (!appPlugin.checktc(this.model.tc.trim())) {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Geçerli Bir TC No  Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (this.model.schoolno.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Okul No  Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (this.model.schoolid == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Okul Seçiniz", "warning", "Tamam");
                } else if (this.model.cbid == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Sınıf ve Şube Seçiniz",
                        "warning",
                        "Tamam"
                    );
                } else {
                    this.$store
                        .dispatch("updateStudent", {
                            id: this.model.userid,
                            name: this.model.username,
                            surname: this.model.usersurname,
                            tc: this.model.tc,
                            schoolno: this.model.schoolno,
                            status: 0, //status
                            type: 0, //öğrenci
                            email: this.model.email,
                            schoolid: this.model.schoolid.id,
                            clasid: this.model.cbid.classid,
                            branchid: this.model.cbid.branchid
                        })
                        .then(res => {
                            if (res.status == 200) {
                                this.onReset();
                                this.$refs.vuetable.reload();
                                appPlugin.showalert(
                                    "Bilgilendirme",
                                    "Öğrenci Başarıyla Güncellendi",
                                    "success",
                                    "Tamam"
                                );
                            } else if (res.status === 204) {
                                appPlugin.showalert(
                                    "Uyarı",
                                    "Tc Numarası,Email Adresi veya Okul Numarasına Sahip Bir Öğrenci Sistemde Kayıtlı",
                                    "warning",
                                    "Tamam"
                                );
                            }
                        })
                        .catch(err => {
                            appPlugin.showalert(
                                "Uyarı",
                                "Öğrenci Güncelleme İşlemi Sırasında Hata Gerçekleşti",
                                "error",
                                "Tamam"
                            );
                        });
                }
            },
            onChangePage(page) {
                this.$refs.vuetable.changePage(page);
            },
            onPaginationData(paginationData) {
                this.$refs.pagination.setPaginationData(paginationData);
                this.$refs.paginationInfo.setPaginationData(paginationData);
            },
            onLoading() {
                this.loading = true;
            },
            onSuccess() {
            },
            onLoaded() {
                this.loading = false;
            },
            onDeleteStudent(row) {
                Swal.fire({
                    title: "Uyarı",
                    text:
                        row.rowData.fullname +
                        " " +
                        "Kaydını Silmek İstediğinize Emin Misiniz ? Bu İşlem Geri Alınamaz",
                    confirmButtonText: "Evet",
                    icon: "info",
                    confirmButtonColor: "red",
                    cancelButtonText: "Hayır",
                    showCancelButton: true
                }).then(res => {
                    if (res.value) {
                        this.loading = true;
                        this.$store
                            .dispatch("deleteStudent", {
                                id: row.rowData.id
                            })
                            .then(res => {
                                if (res.status) {
                                    if (res.status === 200) {
                                        this.$refs.vuetable.reload();
                                        appPlugin.showalert(
                                            "Bilgilendirme",
                                            "Öğrenci Silme İşlemi Başarılı",
                                            "success",
                                            "Tamam"
                                        );
                                    }
                                } else {
                                    appPlugin.showalert(
                                        "Uyarı",
                                        "Öğrenci Silinirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                                        "error",
                                        "Tamam"
                                    );
                                }
                                this.loading = false;
                            });
                    }
                });
            },
            onError(err) {
                debugger
                this.loading = false;

                alert("hata");
            },
            onFetchApi(apiUrl, httpOptions) {
                /* alert(this.searchClassBranch)*/
                if (this.searchClassBranch == true) {
                    return this.$store.dispatch("fetchCBStudent", {
                        opt: httpOptions,
                        clasid: this.selectedClass,
                        branchid: this.selectedBranch
                    })
                } else {
                    if (this.searchtext == "") {
                        return this.$store.dispatch("fetchStudent", {
                            opt: httpOptions,
                            fullname: ""
                        });
                    } else {
                        return this.$store.dispatch("fetchStudent", {
                            opt: httpOptions,
                            fullname: this.searchtext
                        });
                    }
                }

            },
            onReset() {
                this.model = {
                    username: "",
                    usersurname: "",
                    fullname: "",
                    schoolid: "",
                    cbid: "",
                    tc: "",
                    schoolno: "",
                    email: ""
                };
            },
            formValidate() {
                if (this.model.username.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Öğrenci Adı Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (this.model.usersurname.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Öğrenci SoyAdı Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (!appPlugin.validateemail(this.model.email)) {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Geçerli Bir Email Adresi Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (!appPlugin.checktc(this.model.tc)) {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Geçerli Bir TC No  Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (this.model.schoolno.trim() == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Okul No  Giriniz",
                        "warning",
                        "Tamam"
                    );
                } else if (this.model.schoolid == "") {
                    appPlugin.showalert("Uyarı", "Lütfen Okul Seçiniz", "warning", "Tamam");
                } else if (this.model.cbid == "") {
                    appPlugin.showalert(
                        "Uyarı",
                        "Lütfen Sınıf ve Şube Seçiniz",
                        "warning",
                        "Tamam"
                    );
                } else {
                    this.onCreateStudent();
                }
            },
            onCreateStudent() {
                this.loading = true;
                this.$store
                    .dispatch("createStudent", {
                        name: this.model.username,
                        surname: this.model.usersurname,
                        tc: this.model.tc,
                        schoolno: this.model.schoolno,
                        status: 0, //status
                        type: 0, //öğrenci
                        email: this.model.email,
                        schoolid: this.model.schoolid.id,
                        clasid: this.model.cbid.classid,
                        branchid: this.model.cbid.branchid
                    })
                    .then(res => {
                        if (res.status === 200) {
                            this.onReset();
                            this.$refs.vuetable.reload();
                            appPlugin.showalert(
                                "Bilgilendirme",
                                "Öğrenci Başarıyla Eklendi",
                                "success",
                                "Tamam"
                            );
                        } else if (res.status === 204) {
                            appPlugin.showalert(
                                "Uyarı",
                                "Tc Numarası,Email Adresi veya Okul Numarasına Sahip Bir Öğrenci Sistemde Kayıtlı",
                                "warning",
                                "Tamam"
                            );
                        }
                        this.loading = false;
                    })
                    .catch(err => {
                        this.loading = false;
                        appPlugin.showalert(
                            "Uyarı",
                            "Öğrenci Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                            "error",
                            "Tamam"
                        );
                    });
            },
            onChangeSchool(data) {
                this.model.cbid = "";
                this.loading = true;
                this.$store
                    .dispatch("fetchSchoolClassBranch", {schoolid: data.id})
                    .then(res => {
                        this.loading = false;
                    })
                    .catch(err => {
                        this.loading = false;
                        appPlugin.showalert(
                            "Uyarı",
                            "Okula Ait Sınıf ve Şubeler Getirilirken Hata Gerçekleşti",
                            "error",
                            "Tamam"
                        );
                    });
            },
            fetchSchool() {
                this.$store
                    .dispatch("fetchSchools")
                    .then(res => {
                        this.loading = false;
                    })
                    .catch(err => {
                        appPlugin.showalert(
                            "Uyarı",
                            "Okul Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                            "error",
                            "Tamam"
                        );
                        this.loading = false;
                    });
            },
            fetchClas() {

                this.$store
                    .dispatch("fetchClases")
                    .then(res => {
                        this.loading = false;
                    })
                    .catch(err => {
                        appPlugin.showalert(
                            "Uyarı",
                            "Sınıf Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                            "error",
                            "Tamam"
                        );
                        this.loading = false;
                    });

            },
            fetchBranch() {
                this.$store
                    .dispatch("fetchBranches")
                    .then(res => {
                        this.loading = false;
                    })
                    .catch(err => {
                        appPlugin.showalert(
                            "Uyarı",
                            "Şube Kayıtları Getirilirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                            "error",
                            "Tamam"
                        );
                        this.loading = false;
                    });
            }
        },
        created() {
            this.fetchClas();
            this.fetchBranch();
            this.fetchSchool();
        },
        name: "Students"
    };
</script>

<style scoped></style>