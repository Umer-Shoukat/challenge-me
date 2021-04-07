<template>
  <authenticated-layout>
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Challenge Name</label>
        <input
          type="text"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">Challenge Description</label>
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
        ></textarea>
      </div>

      <!-- challenge type -->
      <h3 class="heading-3">Challenge Type</h3>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="challengeType"
          id="solo"
          value="solo"
          checked
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
        />
        <label class="form-check-label" for="open">
          Open
        </label>

        <!-- Is Private -->
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="inlineCheckbox1"
            value="true"
          />
          <label class="form-check-label" for="inlineCheckbox1"
            >Is Challenge is Private</label
          >
        </div>

        <!-- is phusical -->
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="is_physical"
            value="true"
          />
          <label class="form-check-label" for="is_physical">1</label>
        </div>
        <!-- Start Time -->
        <h3 class="heading-3">Start Time</h3>
        <div class="start-date">
          <input type="date" />
        </div>

        <!-- end time -->
        <h3 class="heading-3">End Time</h3>
        <div class="start-date">
          <input type="date" />
        </div>

        <!-- if type challenge type is team then will be the list of his team  -->

        <!-- if challengt is Physical then here will be some google map api's -->
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </authenticated-layout>
</template>

<script>
export default {
  name: "CreateTeam",
};
</script>

<style lang="scss" scoped></style>
