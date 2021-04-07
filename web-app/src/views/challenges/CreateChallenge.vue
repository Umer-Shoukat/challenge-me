<template>
  <authenticated-layout>
    <form @submit.prevent="createChallenge">
      <div class="form-group">
        <label for="exampleInputEmail1">Challenge Name</label>
        <input type="text" class="form-control" v-model="form.name" />
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">Challenge Description</label>
        <textarea
          class="form-control"
          rows="3"
          v-model="form.description"
        ></textarea>
      </div>

      <!-- challenge type -->
      <h5 class="heading-5">Challenge Type</h5>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="challengeType"
          id="solo"
          value="solo"
          v-model="form.type"
        />
        <label class="form-check-label" for="solo">
          Solo
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="challengeType"
          id="team"
          value="team"
          v-model="form.type"
        />
        <label class="form-check-label" for="team">
          Team
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="challengeType"
          id="open"
          value="open"
          v-model="form.type"
        />
        <label class="form-check-label" for="open">
          Open
        </label>
      </div>

      <!-- Is Private -->
      <h5 class="heading-5">Private/Public</h5>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="checkbox"
          id="inlineCheckbox1"
          :value="true"
          v-model="form.is_private"
        />
        <label class="form-check-label" for="inlineCheckbox1"
          >Is Challenge is Private</label
        >
      </div>

      <!-- is phusical -->
      <h5 class="heading-5">Physical/Virtual</h5>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="checkbox"
          id="is_physical"
          :value="true"
          v-model="form.is_physical"
        />

        <label class="form-check-label" for="is_physical"
          >Is Challenge Physical</label
        >
      </div>
      <!-- Start Time -->
      <h5 class="heading-5">Start Time</h5>
      <div class="start-date d-flex align-items-center">
        <input type="date" v-model="form.start_date" />
        <input type="time" v-model="form.start_time" class="ml-5" />
      </div>

      <!-- end time -->
      <h5 class="heading-5">End Time</h5>
      <div class="start-date d-flex align-items-center">
        <input type="date" v-model="form.end_date" />
        <input type="time" v-model="form.end_time" class="ml-5" />
      </div>

      <!-- todo:: if type challenge type is team then will be the list of his team  -->

      <!-- todo:: if challengt is Physical then here will be some google map api's -->

      <!-- todo:: add rules here -->

      <button type="submit" class="btn btn-primary mt-5">Submit</button>
    </form>
  </authenticated-layout>
</template>

<script>
export default {
  name: "CreateChallenge",
  data() {
    return {
      form: {
        name: "",
        description: "",
        type: "solo",
        is_private: false,
        is_physical: false,
        start_time: "",
        start_date: new Date(),
        end_time: "",
        end_date: new Date(),
        creator_team_id: "",
      },
    };
  },
  methods: {
    createChallenge() {
      console.log(this.form);
    },
  },
};
</script>

<style lang="scss" scoped></style>
