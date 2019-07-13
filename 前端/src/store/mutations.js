export default {
  increment(state, opt) {
    state.user = (opt === undefined) ? "" : opt.username
    state.avatar = (opt === undefined) ? "" : opt.avatar
    state.id = (opt === undefined) ? "" : opt._id || opt.uid
    state.role = (opt === undefined) ? "" : opt.role
    state.signedMore = (opt === undefined) ? "" : opt.signedMore
    state.signedList = (opt === undefined) ? "" : opt.signedList
  },
  changeLogin(state,bool){
    state.active = bool
  },
}
