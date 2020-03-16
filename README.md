# arthas
a http request lib

#### useage 

```js
import createArthas from 'arthas'

const { arthas, useArthas } = createArthas({
  baseUrl: 'https://api.examples.com',
  catchcode () {
    // ...
  }
})

arthas.get('/test', {
  foo: 'bar'
}).then(res => {
  // ...
})


// vue component with @vue/composition-api

export default {
  setup () {
    const { code, data, msg } = useArthas('/test', 'get', {
      foo: 'bar'
    })
    
    return {
      msg,
      data,
      code
    }
  }
}

```



