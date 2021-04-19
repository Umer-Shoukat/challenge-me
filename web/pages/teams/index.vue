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

    <v-pagination v-model="page" :length="15" :total-visible="7"></v-pagination>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations, mapActions } = createNamespacedHelpers('team')

import TeamCard from '~/components/cards/team-card'
export default {
  name: 'teams',
  components: { TeamCard },
  data: () => ({
    page: 1,
    search: '',
  }),
  computed: {
    ...mapState(['teams', 'loading', 'pagination']),
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
  },
  async asyncData({ store }) {
    await store.dispatch('team/FETCH_TEAMS')
    return true
  },
  mounted() {},
  created() {
    // this.FETCH_TEAMS()
  },
}
</script>

<style lang="scss" scoped></style>
