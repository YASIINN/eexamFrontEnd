import Vue from "vue";
import Router from "vue-router";
import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";
import store from "./store/index";

Vue.use(Router);

export default new Router({
    linkExactActiveClass: "active",
    mode: "history",
    routes: [
        {
            path: "/",
            redirect: "login",
            component: DashboardLayout,
            children: [
                {
                    path: "/dashboard",
                    name: "dashboard",
                    component: () => import("./views/Dashboard.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/lessons",
                    name: "lessons",
                    component: () => import("./views/Lessons.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/options",
                    name: "options",
                    component: () => import("./views/Options.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/clases",
                    name: "clases",
                    component: () => import("./views/Clases.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/examgroups",
                    name: "examgroups",
                    component: () => import("./views/Groups.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/examchapter",
                    name: "examchapter",
                    component: () => import("./views/ExamChapter.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/examtype",
                    name: "examtype",
                    component: () => import("./views/ExamType.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/branches",
                    name: "branches",
                    component: () => import("./views/Branches.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/schools",
                    name: "schools",
                    component: () => import("./views/Schools.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/schooldetail/:id",
                    name: "schooldetail",
                    component: () => import("./views/SchoolDetail.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/students",
                    name: "students",
                    component: () => import("./views/Students.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/exams",
                    name: "exams",
                    component: () => import("./views/exam/list.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/examcreate",
                    name: "examcreate",
                    component: () => import("./views/exam/create.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/userimport",
                    name: "userimport",
                    component: () => import("./views/userimport.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/persons",
                    name: "persons",
                    component: () => import("./views/Persons.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/changepassword",
                    name: "changepassword",
                    component: () => import("./views/ChangePassword.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                },
                {
                    path: "/studentExam",
                    name: "studentExam",
                    component: () => import("./views/StudentExam.vue"),
                    beforeEnter(to, from, next) {
                        store.dispatch("initAuth").then((res) => {
                            if (res == true) {
                                next();
                            } else {
                                next("/Login")
                            }
                        })

                    }
                }
            ]
        },
        {path: "*", redirect: "/"},
        {
            path: "/",
            redirect: "login",
            component: AuthLayout,
            children: [
                {
                    path: "/login",
                    name: "login",
                    component: () => import("./views/Login.vue")
                },
            ]
        }
    ]
});
