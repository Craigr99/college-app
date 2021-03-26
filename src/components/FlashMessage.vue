<template>
  <div>
    <b-alert
      :show="countDown"
      dismissible
      :variant="alertVariant"
      @dismissed="countDown"
      @dismiss-count-down="countDownChanged"
    >
      {{ alertMessage }}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: "FlashMessage",
  props: {
    courseCreated: Boolean,
    alertMessage: String,
    dismissCountDown: Number,
  },
  data() {
    return {
      dismissSecs: 10,
      showDismissibleAlert: false,
      countDown: this.dismissCountDown,

      alertVariant: "success",
    };
  },
  methods: {
    countDownChanged(countDown) {
      this.countDown = countDown;
    },
    showAlert() {
      this.countDown = this.dismissSecs;
    },
  },
};
</script>
