const _ = {
  compose (...args: any[]) {
    // const args = arguments
    const start = args.length - 1
    return function(this: any) {
      let i = start;
      let result = args[start].apply(this, arguments)
      while (i--) result = args[i].call(this, result)
      return result
    }
  },

  isFunction (obj: any) {
    return typeof obj == 'function' || false
  }
}

export default _
