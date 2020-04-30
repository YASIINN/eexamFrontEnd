<template>
    <div>
        <table class="table table-bordered  table-hover" v-if="rows && rows.length>0">
            <thead>
            <tr>
                <th v-for="title in tableTitle">{{title.name}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,i) in rows">
                <td v-for="col in columns" v-if="col.name!=''">
                    <p>{{row[col.display]}}</p>
                </td>
                <td class="td-actions text-right">
                    <base-button size="sm" v-if="detailVisible" type="info" @click="detailClick(row,i)">Detay
                    </base-button>
                    <base-button size="sm" v-if="downVisible" type="info">
                        <a target="_blank" :href="row.file_path">Görüntüle</a>
                    </base-button>
                    <base-button size="sm" v-if="editVisible" type="warning" @click="editClick(row,i)">Düzenle
                    </base-button>
                    <base-button size="sm" v-if="delVisible" type="danger" @click="deleteClick(row,i)">Sil</base-button>
                    <base-button size="sm" v-if="cancelVisible" type="danger" @click="cancelClick(row,i)">Vazgeç
                    </base-button>
                </td>
            </tr>
            <tr></tr>
            </tbody>
            <p class="text pt-4" style="font-weight: bold;">Toplam Kayıt Sayısı : {{rows.length}}</p>
        </table>
        <table v-else class="table table-striped table-bordered table-hover">
            <thead>
            <th class="d-flex justify-content-center">
                <span class="fa fa-info-circle"></span> Bilgilendirme
            </th>
            </thead>
            <tbody>
            <tr>
                <td>
                    <p class="text text-center">Kayıt Bulunamadı</p>
                </td>
            </tr>
            </tbody>
            <tfoot></tfoot>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'index',
        created() {
        },
        methods: {
            detailClick(e, i) {
                this.$emit('detClick', {
                    item: e,
                    i: i
                })
            },
            downloadClick(e, i) {
                this.$emit('downClick', {
                    item: e,
                    i: i
                })
            },
            deleteClick(e, i) {
                this.$emit('delClick', {
                    item: e,
                    i: i
                })
            },
            cancelClick(e, i) {
                this.$emit('cancelClick', {
                    item: e,
                    i: i
                })
            },
            editClick(e, i) {
                this.$emit('edClick', {
                    item: e,
                    i: i
                })
            }
        },
        data: () => ({}),
        props: {
            cancelVisible: {
                default: false
            },
            detailVisible: Boolean,
            downVisible: Boolean,
            delVisible: Boolean,
            columns: Array,
            tableTitle: Array,
            rows: Array,
            editVisible: Boolean
        }
    }
</script>

<style scoped>
</style>
