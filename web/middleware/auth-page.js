export default ({ store, redirect }) => {
  // If the user is not authenticated
  if (store.state.auth.loggedIn) {
    return redirect('/')
  }
}
