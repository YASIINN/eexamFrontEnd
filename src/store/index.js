import Vue from "vue";
import Vuex from "vuex";
import lessons from "./modules/lesson";
import options from "./modules/options";
import  clases from "./modules/clases"
import groups from "./modules/groups";
import chapter from "./modules/chapter";
import examtype from "./modules/examtype";
import branches from "./modules/branches";
import schools from "./modules/schools";
import student from "./modules/student";
import exam from "./modules/exam";
import shared from "./modules/shared";
import exampartial from "./modules/exampartial";
import examgroupfile from "./modules/examgroupfile";
import auth from "./modules/auth";
import studentexam from "./modules/studentexam";
import user from "./modules/user";
import userexamgroup from "./modules/userexamgroup";
import person from "./modules/persons";
import examdatfiles from "./modules/examdatfiles";
Vue.use(Vuex);


export default new Vuex.Store({
    state: {
    },
    mutations: {

    },
    getters: {

    },
    actions: {

    },
    modules: {
        lessons,
        options,
        clases,
        groups,
        chapter,
        examtype,
        branches,
        schools,
        student,
        exam:exam,
        shared: shared,
        exampartial: exampartial,
        examgroupfile: examgroupfile,
        auth,
        studentexam,
        user:user,
        userexamgroup:userexamgroup,
        person,
        examdatfiles:examdatfiles,
    }
});
