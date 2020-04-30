export default {
    state: {
        errmessage: "",
        successmessage: "",
    },
    mutations: {
        setErrMessage(state, data){
            state.errmessage = data;
        },
        setSucMessage(state, data){
            state.successmessage = data;
        }
    },
    actions: {},
    getters: {
        errmessage: (state)=>state.errmessage,
        successmessage: (state)=>state.successmessage,
    }
}
