<template>
  <authenticated-layout :loading="loading">
    <h1 class="heading">{{ challenge.name }}</h1>
    <p><strong>Deacription:</strong> {{ challenge.description }}</p>

    <!-- if not creator -->
    <div class="cta" v-if="!isCreator">
      <button class="btn btn-primary" v-if="canRequestChallenge">
        Request for Challenge
      </button>
      <button class="btn btn-danger" v-else>withdraw challenge</button>
    </div>

    <!-- if creator -->
    <div v-else>
      <!-- challenger detail -->
      <div v-if="challenge.challenger_id">
        <div>
          <h1>Challenger: {{ challenge.challenger_id }}</h1>
        </div>
        <div v-if="challenge.challenger_team_id">
          <h1>Challenger Team : {{ challenge.challenger_team_id }}</h1>
        </div>

        <button class="btn btn-danger">Remove Challenger</button>
      </div>
      <!-- request lists -->
      <div v-if="challenge.request_list.length">
        <!-- if challenge type is team -->
        <div v-if="challenge.type === 'team'">
          <h1>Team's Detail:</h1>
          <div class="list-group">
            <div
              v-for="request in challenge.request_list"
              :key="request._id"
              class="list-group-item list-group-item-action flex-column align-items-start"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ request.name }}</h5>
              </div>
              <p class="mb-1">{{ request.description }}</p>

              <button class="btn btn-success mb-2">Accept Request</button>
              <button class="btn btn-danger mb-2">Reject Request</button>
            </div>
          </div>
        </div>
        <!-- if challenge type is solo || open -->
        <div v-else>
          <h1>Players Details:</h1>

          <div
            v-for="request in challenge.request_list"
            :key="request._id"
            class="list-group-item list-group-item-action flex-column align-items-start"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ request.name }}</h5>
            </div>

            <button class="btn btn-success mb-2">Accept Request</button>
            <button class="btn btn-danger mb-2">Reject Request</button>
          </div>
        </div>
      </div>
    </div>
  </authenticated-layout>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
export default {
  name: "Challenge",
  data() {
    return {
      challenge: null,
      loading: true,
    };
  },
  computed: {
    ...mapState(["user"]),
    isCreator() {
      return this.user._id === this.challenge.creator_id;
    },
    canRequestChallenge() {
      const {
        type,
        challenger_id,
        challenger_team_id,
        request_list,
      } = this.challenge;

      if (type === "team") {
        const team = request_list.find(
          (team) => team.leader_id === this.user._id
        );
        if (team) return false;
      } else {
        const user = request_list.find((user) => user._id === this.user._id);
        if (user) return false;
      }

      if (type === "team") return !this.isCreator && !challenger_team_id;
      else if (type === "solo") return !this.isCreator && !challenger_id;
      else {
        // todo:: will make the check according to the open challenge
        return true;
      }
    },
  },
  methods: {
    async fetchChallenge() {
      const resp = await this.$axios.get(`challenge/${this.$route.params.id}`);
      this.challenge = resp.data.challenge;
      this.loading = false;
      console.log(resp.data.challenge);
    },
  },
  created() {
    this.fetchChallenge();
  },
};
</script>

<style lang="scss" scoped></style>
