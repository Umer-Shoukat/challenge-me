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
          :src="
            team.images.backgroundImage
              ? team.images.backgroundImage
              : placeholderImage
          "
        ></v-img>

        <v-avatar size="75px" color="accent" class="avatar-image">
          <v-img
            v-if="team.images.image"
            :src="team.images.image ? team.images.image : placeholderImage"
            :lazy-src="placeholderImage"
            aspect-ratio="1"
            round
            class="grey lighten-2"
            max-height="75px"
            max-width="75px"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <span class="white--text headline capitilize" v-else>{{
            team.name | avatarName
          }}</span>
        </v-avatar>
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
  position: absolute;
  transform: translate(40%, -50%);
}
</style>
