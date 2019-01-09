const fs = require('fs');
const service = require('./templates/service');
const store = require('./templates/store');
const view = require('./templates/view');

const options = {
  onboarding: {
    nameSingular: 'onboarding',
    namePlural: 'onboardings',
    methods: ['list', 'create', 'update', 'remove'],
    fields: `[
      {
        name: 'text',
        label: 'Text',
        default: '',
        type: 'textarea',
        rules: [
          v => !!v || 'Text is required',
        ],
      },
      {
        name: 'image',
        label: 'Image',
        default: '',
        sortable: false,
        fileType: 'image',
        type: 'file',
      },
      {
        name: 'order',
        label: 'Order',
        default: 0,
        type: 'number',
      },
      {
        name: 'isActive',
        label: 'Active',
        default: false,
        type: 'checkbox',
      },
    ]`,
  },
  task: {
    nameSingular: 'task',
    namePlural: 'tasks',
    methods: ['list', 'create', 'update', 'remove'],
    fields: `[
      {
        name: 'image',
        label: 'Image',
        default: '',
        type: 'file',
        fileType: 'image',
        sortable: false,
      },
      {
        name: 'title',
        label: 'Title',
        default: '',
      },
      {
        name: 'text',
        label: 'Text',
        default: '',
        type: 'textarea',
        showOnTable: false,
      },
      {
        name: 'order',
        label: 'Order',
        default: '',
        type: 'number',
      },
      {
        name: 'isWelcome',
        label: 'Welcome task',
        default: false,
        type: 'checkbox',
      },
    ]`,
  },
};


for (let key in options) {
  const serviceFile = service(options[key]);
  fs.writeFileSync(`_generated/${serviceFile.path}/${serviceFile.name}`, serviceFile.content)

  const storeFile = store(options[key]);
  fs.writeFileSync(`_generated/${storeFile.path}/${storeFile.name}`, storeFile.content)

  const viewFile = view(options[key]);
  fs.writeFileSync(`_generated/${viewFile.path}/${viewFile.name}`, viewFile.content)
}
