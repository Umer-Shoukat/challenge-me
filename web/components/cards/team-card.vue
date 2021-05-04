<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="mb-5 cursor-pointer"
      @click="$router.push(`/teams/${team._id}`)"
      :elevation="hover ? 10 : 1"
    >
      <div class="relative">
        <v-img
          height="200"
          :lazy-src="placeholderImage"
          :src="team.background_url ? team.background_url : placeholderImage"
        ></v-img>

        <avatar
          size="75"
          color="accent"
          class="avatar-image"
          :src="team.image_url"
          :alt="team.name"
          nameSize="2"
        />
      </div>

      <v-card-title class="mt-10">{{ team.name }}</v-card-title>

      <v-card-text>
        <div class="my-2 subtitle-1">
          {{ team.description | truncate }}
        </div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-subtitle>
        Players
        <span class="ml-1"
          >{{ team.players_list.length }}/{{ team.players_limit }}</span
        >
      </v-card-subtitle>

      <v-card-text>
        <v-chip :color="team.isPrivate ? 'danger' : 'primary'">
          <v-icon left>
            {{ team.isPrivate ? 'mdi-lock' : 'mdi-lock_open' }}
          </v-icon>
          {{ team.isPrivate ? 'Private' : 'Public' }}</v-chip
        >
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
import imagePlaceholder from '~/constants/imagesPlaceholder'
export default {
  props: {
    team: {
      type: Object,
      required: true,
    },
  },
  name: 'team-card',
  data: () => ({
    placeholderImage: imagePlaceholder.teamBackground,
  }),
}
</script>

<style lang="scss" scoped>
.avatar-image {
  position: absolute !important;
  transform: translate(40%, -50%);
}
</style>
