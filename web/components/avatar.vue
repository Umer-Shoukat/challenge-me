<template>
  <v-avatar :size="size + 'px'" color="dark">
    <v-img v-if="src" :lazy-src="lazyImage" :src="src" :height="size" contain>
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <span
      class="white--text headline capitilize"
      :style="`font-size: ${nameSize}rem !important`"
      v-else
      >{{ alt | avatarName }}</span
    >
  </v-avatar>
</template>

<script>
export default {
  name: 'avatar',
  props: {
    size: {
      default: '50',
      type: [String, Number],
    },
    lazyImage: {
      default: 'https://picsum.photos/150/150',
      type: String,
    },
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: 'NA',
    },
    nameSize: {
      type: [String, Number],
      default: '1',
    },
  },
}
</script>

<style lang="scss" scoped></style>
