<template>
  <authenticated-layout>
    <div class="mb-4">
      <button class="btn btn-primary">Create Challenge</button>
      <button class="btn btn-secondary ml-3">Create Team</button>
    </div>
    <div class="row">
      <div
        class="col-lg-3 col-md-6 col-12"
        v-for="challenge in challenges"
        :key="challenge._id"
      >
        <div
          class="card mb-3"
          @click="$router.push(`/challenge/${challenge._id}`)"
        >
          <img
            class="card-img-top"
            src="https://via.placeholder.com/200x90.png"
            alt="Card image cap"
          />
          <div class="card-body">
            <h5 class="card-title">{{ challenge.name }}</h5>
            <p>
              <span class="badge badge-secondary">{{
                challenge.is_private ? "Private" : "Public"
              }}</span>

              <span class="badge badge-secondary ml-3">{{
                challenge.is_physical ? "Physical" : "Virtual"
              }}</span>
            </p>

            <p class="card-text">
              {{ challenge.description }}
            </p>

            <p class="card-text">
              Challenge Type
              <span class="badge badge-primary">{{ challenge.type }}</span>
            </p>
          </div>
          <div class="card-footer">
            <small class="text-muted"
              >Start: {{ moment(challenge.start_time).format("lll") }}</small
            >
            <br />
            <small class="text-muted"
              >End: {{ moment(challenge.end_time).format("lll") }}</small
            >
          </div>
        </div>
      </div>
    </div>
  </authenticated-layout>
</template>

<script>
// @ is an alias to /src
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");

import moment from "moment";
export default {
  name: "Home",
  data() {
    return {
      challenges: [],
      moment: moment,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async fetchChallenges() {
      try {
        const resp = await this.$axios.get("challenges");

        const { challenges } = resp.data;
        this.challenges = challenges;
      } catch (err) {
        console.log(err);
      }
    },
  },
  created() {
    this.fetchChallenges();
  },
};
</script>
