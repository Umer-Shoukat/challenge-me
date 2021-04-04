<template>
  <authenticated-layout>
    <div class="mb-4">
      <button class="btn btn-primary">Create Challenge</button>
      <button class="btn btn-secondary ml-3">Create Team</button>
    </div>

    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Serch Challenge"
        aria-describedby="button-addon2"
        v-model="search_query"
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-primary"
          type="button"
          id="button-addon2"
          @click="fetchChallenges"
        >
          Search
        </button>
      </div>
    </div>

    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <label class="input-group-text" for="inputGroupSelect01"
          >Select Limit</label
        >
      </div>
      <select
        class="custom-select"
        id="inputGroupSelect01"
        v-model="limit"
        @change="(page = 1), fetchChallenges()"
      >
        <option value="1">1</option>
        <option value="5">5</option>
        <option value="10">10</option>
      </select>
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

    <nav aria-label="Page navigation example my-5">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: !prevPage }">
          <button class="page-link" @click="goPrevPage">
            Previous
          </button>
        </li>
        <li
          class="page-item"
          :class="{ active: page == n }"
          v-for="n in totalPages"
          :key="n"
          @click="goToPage(n)"
        >
          <button class="page-link">
            {{ n }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: !nextPage }">
          <button class="page-link" @click="goNextPage">
            Next
          </button>
        </li>
      </ul>
    </nav>
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
      search_query: "",
      moment: moment,
      limit: 10,
      page: 1,
      pagingCounter: 1,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
      totalDocs: null,
      totalPages: null,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async fetchChallenges() {
      try {
        const resp = await this.$axios.get(
          `challenges?query=${this.search_query}&page=${this.page}&limit=${this.limit}`
        );

        let keys = Object.keys(resp.data);
        keys.forEach((key) => {
          this[key] = resp.data[key];
        });
        console.log(resp);
      } catch (err) {
        console.log(err);
      }
    },
    goPrevPage() {
      if (!this.prevPage && this.page == this.prevPage) return;
      this.page = this.prevPage;
      this.fetchChallenges();
    },
    goNextPage() {
      if (!this.nextPage && this.page == this.nextPage) return;
      this.page = this.nextPage;
      this.fetchChallenges();
    },
    goToPage(page) {
      if (page == this.page) return;
      this.page = Number(page);
      this.fetchChallenges();
    },
  },
  created() {
    this.fetchChallenges();
  },
};
</script>
