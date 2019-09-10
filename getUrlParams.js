{
  // ?key=val&key1=val1
  function getUrlParam(param) { // param -> key or key1
    let urlSearch = window.location.search.substring(1)
    let vars = urlSearch.split('&')
    for (let index = 0; index < vars.length; index++) {
      let _param = vars[index].split('=')
      if (param == _param[0]) {
        return _param[1]
      }
    }
    return false
  }
}