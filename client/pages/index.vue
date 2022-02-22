<template>
  <!-- <Tutorial /> -->
  <div>{{ hello }}</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';

@Component({
  name: 'index',
})
export default class Index extends Vue {
  async asyncData({ $axios }: Context) {
    const hello = (await $axios.get('/')).data;

    return {
      hello,
    };
  }
}
</script>
