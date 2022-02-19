<template>
  <!-- <Tutorial /> -->
  <div>{{ hello }}</div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types';
import Vue from 'vue';

export default Vue.extend({
  name: 'IndexPage',
  async asyncData({ $axios }: Context) {
    const hello = (await $axios.get('/')).data;

    return {
      hello,
    };
  },
});
</script>
