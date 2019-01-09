module.exports = (options) => {
  const {nameSingular, namePlural, methods} = options
  let generated = `import axios from './axios';

`;

  if (methods.includes('get')) {
    generated += `async function get(id) {
  const response = await axios({
    method: 'get',
    url: \`/${namePlural}/\${id}\`,
  });
  return response.data;
}

`;
  }

  if (methods.includes('list')) {
    generated += `async function list(params) {
  const response = await axios({
    method: 'get',
    url: '/${namePlural}',
    params,
  });
  return response.data;
}

`;
  }

  if (methods.includes('create')) {
    generated += `async function create(data) {
  const response = await axios({
    method: 'post',
    url: '/${namePlural}',
    data,
  });
  return response.data;
}

`;
  }

  if (methods.includes('update')) {
    generated += `async function update(data) {
  const response = await axios({
    method: 'put',
    url: \`/${namePlural}/\${data.id}\`,
    data,
  });
  return response.data;
}

`;
  }

  if (methods.includes('remove')) {
    generated += `async function remove(id) {
  const response = await axios({
    method: 'delete',
    url: \`/${namePlural}/\${id}\`,
  });
  return response.data;
}

`;
  }

  generated += `export default {
  ${methods.join(',\n  ')},
};
`;

  const file = {
    path: `admin/src/_services`,
    name: `${nameSingular}.service.js`,
    content: generated,
  };

  return file;
};
