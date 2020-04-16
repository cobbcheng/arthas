# arthas
a http request lib based on Fetch

#### useage 

basic

```javascript
import Arthas from 'arthas'

const api = new Arthas({
  baseUrl: 'https://api.examples.com',
  catchCode (e) {
    // handle error
  }
})

api.post('/test', {
  foo: 'bar'
}).then(res => {
  // handle response
})
```

advance

```js
import { createArthas } from 'arthas'

const { arthas, useArthas } = createArthas({
  baseUrl: 'https://api.examples.com',
  catchCode () {
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



