<template>
  <loader :loading="loading" height="500px">
    <div class="cropper">
      <input
        type="file"
        ref="inputFile"
        accept="image/*"
        class="d-none"
        @change="loadImage"
      />
      <!-- placeholder image -->
      <div
        class="cropper-placeholder"
        :class="dragging ? 'dragging' : ''"
        v-if="!image.src"
        @click="$refs.inputFile.click()"
        @dragover.prevent="dragOver"
        @dragleave.prevent="dragLeave"
        @drop.prevent="drop"
      >
        <v-img lazy-src="/images/svg/img-uploader.svg" height="400" contain />
      </div>
      <!-- main cropper -->
      <div class="cropper-wrapper" v-else>
        <div
          :style="{ backgroundImage: 'url(' + image.src + ')' }"
          class="image-background"
        ></div>

        <cropper
          class="cropper"
          background-class="cropper-background"
          :src="image.src"
          :stencil-props="{
            handlers: {},
            movable: true,
            scalable: true,
            aspectRatio: aspectRatio,
          }"
          :resize-image="{
            adjustStencil: false,
          }"
          :stencil-size="{
            width: stencilHeight,
            height: stencilHeight,
          }"
          :auto-zoom="true"
          image-restriction="stencil"
          :stencil-component="rounded ? 'circle-stencil' : 'rectangle-stencil'"
          ref="cropper"
          @ready="ready"
          @error="error"
        />
      </div>

      <!-- action btns -->
      <div class="d-flex mt-5">
        <v-btn @click="$refs.inputFile.click()" class="mr-3"
          >Upload Image</v-btn
        >

        <v-btn color="success" @click="reset" class="mr-3">Reset Image</v-btn>

        <v-btn @click="crop" :disabled="!image.src">Save</v-btn>
      </div>
    </div>
  </loader>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

import { createNamespacedHelpers } from 'vuex'
const modalModule = createNamespacedHelpers('globalModal')

// SET_GLOBAL_LOADING
export default {
  name: 'image-cropper',
  props: {
    uploadEndPoint: String,
    fieldName: String,
    stencilHeight: {
      type: Number,
      default: 250,
    },
    stencilWidth: {
      type: Number,
      default: 250,
    },
    aspectRatio: {
      type: Number,
      default: 1,
    },
    emitFile: {
      type: Boolean,
      default: false,
    },
    imageFile: {
      require: false,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Cropper,
  },
  data() {
    return {
      image: {
        src: null,
        type: null,
      },
      loading: false,
      dragging: false,
    }
  },
  computed: {
    ...modalModule.mapState(['activeModal']),
  },
  methods: {
    ...modalModule.mapMutations(['CLOSE_MODAL', 'SET_CROPPER_PAYLOAD']),
    ready() {
      console.log('ready')
    },
    error(err) {
      console.log('if Error', err)
    },
    drop(event) {
      this.dragging = false
      let file = event.dataTransfer.files[0]
      if (!file) return
      this.addFileToCropper(file)
    },
    dragOver() {
      this.dragging = true
    },
    dragLeave() {
      this.dragging = false
    },
    loadImage(event) {
      const { files } = event.target
      if (files && files[0]) {
        this.addFileToCropper(files[0])
      }
    },
    crop() {
      const { canvas } = this.$refs.cropper.getResult()
      canvas.toBlob(async (blob) => {
        if (this.emitFile) {
          this.SET_CROPPER_PAYLOAD({ blob, src: this.image.src })
        } else {
          const fd = new FormData()
          fd.append(this.fieldName, blob)
          this.loading = true
          const resp = await this.$axios.post(this.uploadEndPoint, fd, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          console.log('IMAGE UPLOADED SUCCESSFULLY')
          this.loading = false
          if (resp.data.user) {
            this.$auth.setUser(resp.data.user)
          }
        }
        if (this.activeModal) {
          this.CLOSE_MODAL()
        }
      }, this.image.type)
    },
    reset() {
      this.image = {
        src: null,
        type: null,
      }
    },
    addFileToCropper(file) {
      if (this.image.src) {
        URL.revokeObjectURL(this.image.src)
      }
      const blob = URL.createObjectURL(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        this.image = {
          src: blob,
          type: this.getMimeType(e.target.result, file.type),
        }
        this.$refs.inputFile.value = null
      }
      reader.readAsDataURL(file)
    },

    getMimeType(file, fallback = null) {
      const byteArray = new Uint8Array(file).subarray(0, 4)
      let header = ''
      for (let i = 0; i < byteArray.length; i++) {
        header += byteArray[i].toString(16)
      }
      switch (header) {
        case '89504e47':
          return 'image/png'
        case '47494638':
          return 'image/gif'
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          return 'image/jpeg'
        default:
          return fallback
      }
    },
  },
  created() {
    if (this.imageFile) this.addFileToCropper(this.imageFile)
  },
}
</script>

<style lang="scss" scoped>
.cropper-placeholder {
  height: 400px;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &.dragging {
    border: 2px solid #fff;
  }
}

.cropper-wrapper {
  overflow: hidden;
  position: relative;
  height: 400px;
  margin: auto;
  background: black;
}
.cropper-background {
  background: none !important;
}
.image-background {
  position: absolute;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  left: -10px;
  top: -10px;
  background-size: cover;
  background-position: 50%;
  filter: blur(5px);
}
</style>
