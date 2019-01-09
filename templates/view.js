module.exports = (options) => {
  const {nameSingular, namePlural, methods, fields} = options;
  let generated = `<template>
  <v-container fluid>
    <h1>{{viewName}}</h1>
    <CRUDTable
      :viewName="viewName"
      :fields="fields"
      :items="items"
      :total-items="totalItems"
      :loading="loading"
      :errors="errors"
`;

  methods.forEach((method) => {
    switch (method) {
      case 'list':
        generated += `      :onPaginate="onPaginate"
`;
        break;
      case 'create':
        generated += `      :onCreate="onCreate"
`;
        break;
      case 'update':
        generated += `      :onUpdate="onUpdate"
`;
        break;
      case 'remove':
        generated += `      :onRemove="onRemove"
`;
        break;
    }
  });

  generated += `    >
    </CRUDTable>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import CRUDTable from '../components/CRUDTable.vue';

export default {
  components: { CRUDTable },
  data: () => ({
    viewName: '${nameSingular.charAt(0).toUpperCase() + nameSingular.slice(1)}',
    pagination: {},
    fields: `;

  generated += fields
  generated += `,
  }),
  computed: {
    ...mapState({
      loading: state => state.${nameSingular}.loading,
      items: state => state.${nameSingular}.${namePlural},
      totalItems: state => state.${nameSingular}.total${namePlural.charAt(0).toUpperCase() + namePlural.slice(1)},
    }),
    ...mapGetters('${nameSingular}', ['errors']),
  },
  methods: {
    ...mapActions('${nameSingular}', [`;
  generated += methods.map(m=>`'${m}'`).join(', ');

  generated += `]),
`;

  methods.forEach((method) => {
    switch (method) {
      case 'list':
        generated += `    async onPaginate(pagination = {}) {
      this.pagination = pagination;
      await this.list(this.pagination);
    },
`;
        break;
      case 'create':
        generated += `    async onCreate(item) {
      await this.create(item);
      await this.list(this.pagination);
    },
`;
        break;
      case 'update':
        generated += `    async onUpdate(item) {
      await this.update(item);
      await this.list(this.pagination);
    },
`;
        break;
      case 'remove':
        generated += `    async onRemove(item) {
      await this.remove(item.id);
      await this.list(this.pagination);
    },
`;
        break;
    }
  });

  generated += `  },
};
</script>

<style scoped>

</style>
`;

  const file = {
    path: `admin/src/views`,
    name: `${nameSingular}.vue`,
    content: generated,
  };

  return file;
};
