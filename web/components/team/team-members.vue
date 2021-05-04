<template>
  <div>
    <h1 class="mb-3">Team Players</h1>
    <v-row v-if="users.length">
      <v-col md="6" cols="12" v-for="member in users" :key="member._id">
        <v-card elevation="4" outlined shaped @click="goToProfile(member._id)">
          <v-card-text class="text-center">
            <avatar
              :src="member.avatar"
              :alt="member.name"
              size="80"
              nameSize="1.5"
            />
            <h2 class="name mt-4">{{ member.name }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card elevation="4" outlined shaped v-else class="mt-10">
      <v-card-text class="text-center">
        <h1 class="py-10">No Player at the moment</h1>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'TeamMembers',
  props: {
    members: {
      type: Array,
      defaullt: () => [],
    },
  },
  computed: {
    users() {
      return this.members.filter((user) => user._id !== this.$auth.user._id)
    },
  },
  methods: {
    goToProfile(id) {
      this.$store.commit('globalModal/CLOSE_MODAL')
      this.$router.push(`/user/${id}`)
    },
  },
}
</script>

<style lang="scss" scoped></style>
