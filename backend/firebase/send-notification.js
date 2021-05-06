const axios = require("axios");

const $api = axios.create({
  baseURL: "https://fcm.googleapis.com/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `key=${process.env.FIREBASE_PUSH_NOTIFICATION_SERVER_KEY}`,
  },
});

module.exports = (messageObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(messageObj);
      const resp = await $api.post("fcm/send", messageObj);
      // console.log("inside create noti resp", resp.data);
      resolve(resp);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
