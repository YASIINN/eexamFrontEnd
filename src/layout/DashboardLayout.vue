<template>
    <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
        <side-bar
                :background-color="sidebarBackground"
                short-title="Zafer IT"
                title="Zafer IT"
        >
            <template slot="links">
                <sidebar-item
                        :link="{
            name: 'Dashboard',
            icon: 'ni ni-tv-2 text-primary',
            path: '/dashboard'
          }"
                />

                <!--Type 1 ise Personel Ekranları-->

                <!--Öğrenci Ekranı-->
                <!-- v-if="$store.getters.getUser.type==0"-->

                <sidebar-item
                        v-if="$store.getters.getUser.type==0"
                        :link="{
            name: 'Sınavlar',
            icon: 'fa fa-stream text-danger',
            path: '/studentExam'
          }"
                />
                <!--  v-if="$store.getters.getUser.type==1"-->
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Öğrenciler',
            icon: 'ni ni-key-25 text-info',
            path: '/students'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Okullar',
            icon: 'fa fa-school text-info',
            path: '/schools'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Şubeler',
            icon: 'fa fa-code-branch text-success',
            path: '/branches'
          }"
                />

                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Sınav Türleri',
            icon: 'fa fa-quote-right text-dark',
            path: '/examtype'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Sınav Bölümleri',
            icon: 'fa fa-align-justify text-warning',
            path: '/examchapter'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Seçenekler',
            icon: 'fa fa-filter text-info',
            path: '/options'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Sınav Grupları',
            icon: 'fa fa-object-group text-purple',
            path: '/examgroups'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Sınıflar',
            icon: 'fa fa-graduation-cap text-green',
            path: '/clases'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                    :link="{
            name: 'Dersler',
            icon: 'fa fa-book text-red',
            path: '/lessons'
          }"
            />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Sınavlar',
            icon: 'fa fa-book text-red',
            path: '/exams'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Personeller',
            icon: 'fa fa-user text-yellow',
            path: '/persons'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Sınav Oluştur',
            icon: 'fa fa-book text-red',
            path: '/examcreate'
          }"
                />
                <sidebar-item
                        v-if="$store.getters.getUser.type==1"
                        :link="{
            name: 'Öğrenci İmport',
            icon: 'fa fa-book text-red',
            path: '/userimport'
          }"
                />
                <sidebar-item
                        :link="{
            name: 'Parola Değiştir',
            icon: 'fa fa-lock text-red',
            path: '/changepassword'
          }"
                />
            </template>
        </side-bar>
        <div class="main-content" :data="sidebarBackground">
            <dashboard-navbar></dashboard-navbar>

            <div @click="toggleSidebar">
                <fade-transition :duration="200" origin="center top" mode="out-in">
                    <!-- your content here -->
                    <router-view></router-view>
                </fade-transition>
                <content-footer v-if="!$route.meta.hideFooter" style="padding-top: 200px"></content-footer>
            </div>
        </div>
    </div>
</template>
<script>
    import DashboardNavbar from "./DashboardNavbar.vue";
    import ContentFooter from "./ContentFooter.vue";
    import {FadeTransition} from "vue2-transitions";

    export default {
        components: {
            DashboardNavbar,
            ContentFooter,
            FadeTransition
        },
        data() {
            return {
                sidebarBackground: "vue" //vue|blue|orange|green|red|primary
            };
        },
        methods: {
            toggleSidebar() {
                if (this.$sidebar.showSidebar) {
                    this.$sidebar.displaySidebar(false);
                }
            }
        }
    };
</script>
<style lang="scss"></style>
