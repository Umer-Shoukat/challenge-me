import VueSocketIO from "vue-socket.io";

export default new VueSocketIO({
  debug: true,
  connection: "http://localhost:3000/",
});
