<template>
  <div>
    <h1>Vue is awesome</h1>
    <h2>{{code}}</h2>
  </div>
</template>

<script>
import createArthas from 'arthas'
export default {
  setup () {
    const { useArthas } = createArthas({
      baseUrl: 'https://api.shuidimiaoyi.com'
    })
    const { code } = useArthas('/api/todo/something', 'get', {
      a: 'b'
    })

    return { code }
  }
}
</script>
