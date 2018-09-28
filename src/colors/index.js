export default {
  fetch({model='default', samples=[], count=5} = {}) {
    return fetch('http://colormind.io/api/', {
      method: 'POST',
      body: JSON.stringify({model, input: [...samples, ..._.times(count - samples.length, _.constant('N'))]})
    })
    .then(response => response.json())
    .then(({result}) => result.map(rgb => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`))
    .catch(err => console.log(err)); //eslint-disable-line
  }
};
