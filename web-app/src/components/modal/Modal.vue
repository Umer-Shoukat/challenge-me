<template>
  <transition
    mode="out-in"
    enter-active-class="animate__animated animate__bounceIn"
    leave-active-class="animate__animated animate__bounceOut"
  >
    <div v-if="show" class="modal" @click.self="$emit('close-modal')">
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);

  display: grid;
  place-items: center;

  &-content {
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    max-width: 90%;
  }
}
</style>
