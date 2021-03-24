<template>
  <b-row cols="3">
    <b-col>
      <router-link :to="{ name: 'courses_index' }">
        <b-card align="center">
          <img src="../assets/courses.svg" alt="Courses" class="image" />
          <h2 class="pt-4">Courses</h2>
        </b-card>
      </router-link>
    </b-col>
    <b-col>
      <router-link :to="{ name: 'lecturers_index' }">
        <b-card align="center">
          <img src="../assets/lecturer.svg" alt="Lecturers" class="image" />
          <h2 class="pt-4">Lecturers</h2>
        </b-card>
      </router-link>
    </b-col>
    <b-col>
      <router-link :to="{ name: 'enrolments_index' }">
        <b-card align="center">
          <img src="../assets/enrolment.svg" alt="Enrolments" class="image" />
          <h2 class="pt-4">Enrolments</h2>
        </b-card>
      </router-link>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "ImageLinks",
};
</script>

<style scoped>
.image {
  height: 200px;
}
</style>