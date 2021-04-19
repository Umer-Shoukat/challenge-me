<template>
  <v-card class="mb-5">
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

    <v-card-text>
      <v-chip color="primary">{{
        team.isPrivate ? 'Private' : 'Public'
      }}</v-chip>
    </v-card-text>

    <v-card-actions>
      <v-btn color="deep-purple lighten-2" text> Reserve </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    team: {
      type: Object,
      required: true,
    },
  },
  name: 'team-card',
  data: () => ({
    placeholderImage: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
  }),
}
</script>

<style lang="scss" scoped>
.avatar-image {
  position: absolute;
  transform: translate(40%, -50%);
}
</style>
