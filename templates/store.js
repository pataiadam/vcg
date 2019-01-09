module.exports = (options) => {
  const {nameSingular, namePlural, methods} = options;
  let generated = `/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-underscore-dangle: ["off"] */
import services from '../_services';

const { ${nameSingular}Service } = services;

const initialState = {
  loading: false,
  errorState: {},
  ${namePlural}: [],
  total${namePlural.charAt(0).toUpperCase() + namePlural.slice(1)}: 0,
};

const actions = {
`;

  methods.forEach((method)=>{
    const capMethod = method.charAt(0).toUpperCase() + method.slice(1)
    generated += `  async ${method}({ commit }, params) {
    commit('${nameSingular}${capMethod}Request');
    const response = await ${nameSingular}Service.${method}(params);
    commit(response.isSuccess ? '${nameSingular}${capMethod}Success' : '${nameSingular}${capMethod}Failure', response);
  },
`
  });

  generated += `};

const mutations = {
`;

  generated += methods.map((method)=>{
    const capMethod = method.charAt(0).toUpperCase() + method.slice(1);

    if (method === 'list') {
      return `  ${nameSingular}${capMethod}Request(state) {
    this._vm.$set(state.errorState, '${method}', null);
    state.loading = true;
  },
  ${nameSingular}${capMethod}Success(state, { payload }) {
    state.loading = false;
    state.${namePlural} = payload.items;
    state.total${namePlural.charAt(0).toUpperCase() + namePlural.slice(1)} = payload.totalItems;
  },
  ${nameSingular}${capMethod}Failure(state, { error }) {
    this._vm.$set(state.errorState, '${method}', error);
    state.loading = false;
    state.${namePlural} = [];
  },
`
    } else {
      return `  ${nameSingular}${capMethod}Request(state) {
    this._vm.$set(state.errorState, '${method}', null);
    state.loading = true;
  },
  ${nameSingular}${capMethod}Success(state) {
    state.loading = false;
  },
  ${nameSingular}${capMethod}Failure(state, { error }) {
    this._vm.$set(state.errorState, '${method}', error);
    state.loading = false;
  },
`
    }
  }).join('\n');

  generated += `};

export default {
  namespaced: true,
  state: initialState,
  actions,
  mutations,
  getters: {
    errors: (state) => {
      let errs = [];
      // eslint-disable-next-line
      for (const type in state.errorState) {
        if (state.errorState[type]) {
          errs.push(state.errorState[type].message);
          errs = errs.concat((state.errorState[type].details || []));
        }
      }
      return errs;
    },
  },
};
`;


  const file = {
    path: `admin/src/_store`,
    name: `${nameSingular}.module.js`,
    content: generated,
  };

  return file;
};
