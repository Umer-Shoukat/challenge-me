<template>
  <div v-if="loading">
    <v-row>
      <v-col cols="12" lg="3" md="4" v-for="n in 3" :key="n">
        <v-skeleton-loader
          v-bind="attrs"
          type=" image, article"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
  </div>

  <div v-else>
    <div class="text-right mb-2">
      <v-btn to="/teams/create" color="info" class="mr-3">Create Team</v-btn>
    </div>
    <div class="search-team">
      <v-text-field
        label="Search Team"
        filled
        v-model="search"
        clearable
      ></v-text-field>
    </div>

    <v-row>
      <v-col cols="12" lg="3" md="4" v-for="team in teams" :key="team._id">
        <team-card :team="team" />
      </v-col>
    </v-row>

    <v-pagination
      v-model="page"
      :length="pagination.totalPages"
      :total-visible="6"
    ></v-pagination>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations, mapActions } = createNamespacedHelpers('team')

import TeamCard from '~/components/cards/team-card'
import debounce from 'lodash/debounce'
export default {
  name: 'teams',
  components: { TeamCard },
  data: () => ({
    page: 1,
    debounce: null,
  }),
  computed: {
    ...mapState(['teams', 'loading', 'pagination', 'searchQuery']),
    search: {
      set(val) {
        return this.SET_SEARCH(val)
      },
      get() {
        return this.searchQuery
      },
    },
    attrs() {
      return {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      }
    },
  },
  methods: {
    ...mapActions(['FETCH_TEAMS']),
    ...mapMutations(['SET_SEARCH']),
  },
  async asyncData({ store }) {
    await store.dispatch('team/FETCH_TEAMS')
    return true
  },
  watch: {
    search(val, old) {
      if (val !== old) {
        this.debounce()
      }
    },
    page(val) {
      this.FETCH_TEAMS(val)
    },
  },
  mounted() {
    this.debounce = debounce(() => {
      this.FETCH_TEAMS()
    }, 1000)
  },
  created() {},
}
</script>

<style lang="scss" scoped></style>
