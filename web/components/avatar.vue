<template>
  <v-avatar :size="size + 'px'" :color="bgColor" v-if="!active">
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
      class="white--text headline uppercase"
      :style="`font-size: ${nameSize}rem !important`"
      v-else
      >{{ alt | avatarName }}</span
    >
  </v-avatar>
  <v-badge v-else round bottom color="success" dot offset-x="10" offset-y="10">
    <v-avatar :size="size + 'px'" :color="!src ? bgColor : 'dark'">
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
        class="white--text headline uppercase"
        :style="`font-size: ${nameSize}rem !important`"
        v-else
        >{{ alt | avatarName }}</span
      >
    </v-avatar>
  </v-badge>
</template>

<script>
import { getRandomNumber, getRandomColors } from '~/helpers'
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
    color: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    colors() {
      return getRandomColors(200)
    },
    bgColor() {
      if (this.color) return this.color
      return this.colors[getRandomNumber(0, this.colors.length - 1)]
    },
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.active {
  position: absolute;
  bottom: 0;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  right: 0;
  border: 2px solid #333;
  border-color: #333 !important;
}
</style>
