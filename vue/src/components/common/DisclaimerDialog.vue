<template>
  <modal-dialog
    :show="show"
    @ok="context.emit('ok')"
    @cancel="context.emit('cancel')"
  >
    <h2>WARNING</h2>
    <div class="text-left">
      This application is a hobby project.
      <strong>Do not provide personal information</strong>, because it is not
      protected. Personal information may be anything which is not testing data.
      <br />
      All data you enter will be stored locally in your browser.
      <br />
      If you create and use an account, those data will be stored on the server,
      where they are publicly accessible! As this violates public laws, you are
      not allowed to enter personal information when you are using an account.
      Personal information may be any information you might enter, except for
      testing purposes.
      <br /><br />
      <b>Do you agree to never enter any personal data here?</b>
    </div>
  </modal-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ModalDialog from "@/components/common/ModalDialog.vue";

export default defineComponent({
  components: { ModalDialog },
  props: {
    show: Boolean,
  },
  setup(_: unknown, context) {
    return {
      context,
    };
  },
});
</script>
