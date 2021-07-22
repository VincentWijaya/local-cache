const none = 'NoneEvictionManager'
const lru = 'LRUEvictionManager'
const lfu = 'LFUEvictionManager'

class NoneEvictionManager {
  constructor(limit) {
    this.limit = limit
    this.cache = []
    this.cacheSize = 0
  }

  Add(key, value) {
    if (this.cache[key]) {
      this.cache[key] = value
      return 1
    }

    if (this.limit == this.cacheSize) {
      return new Error('key_limit_exceeded')
    }

    this.cache[key] = value
    this.cacheSize++
    return 0
  }

  Get(key) {
    return this.cache[key]
  }

  Keys() {
    return Object.keys(this.cache)
  }

  Clear() {
    const size = this.cacheSize
    this.cache = []
    this.cacheSize = 0

    return size
  }
}

class LRUEvictionManager {
  constructor(limit) {
    this.limit = limit
    this.cache = new Map()
  }

  remove(key) {
    this.cache.delete(key)
    return [...this.cache.keys()]
  }

  evict() {
    const oldestCache = this.cache.keys().next().value
    this.remove(oldestCache)
    return [...this.cache.keys()]
  }

  Clear() {
    const size = this.cache.size
    this.cache.clear()
    return size
  }

  Add(key, val) {
    if (!this.cache.has(key) && this.cache.size == this.limit) {
      this.evict()
    }

    if (this.cache.has(key) == true) {
      this.cache.set(key, val)
      return 1
    }
    
    this.cache.set(key, val)
    return 0
  }

  Get(key) {
    const value = this.cache.get(key)
    if (value) {
      this.remove(key)
      this.Add(key, value)

      return value
    }
  }

  Keys() {
    return [...this.cache.keys()]
  }
}

class LFUEvictionManager {
  constructor(limit) {
    this.cache = {}
    this.freqMap = new Map()
    this.limit = limit
    this.counter = 1
  }

  Get(key) {
    if (this.cache[key]) {
      this.cache[key].count++
      this.freqMap.delete(key)
      this.freqMap.set(key, this.counter++)

      return this.cache[key].val
    }
  }

  Add(key, val) { 
    let result = 0
    if (this.cache[key]) {
      this.cache[key].val = val
      this.freqMap.delete(key)
      result = 1
    } else {
      this.cache[key] = {
        val: val,
        count: 1
      }
    }

    if (Object.keys(this.cache).length > this.limit) {
      const arr = Object.keys(this.cache).sort((a, b) => {
        if(this.cache[a].count == this.cache[b].count) {
          return this.freqMap.get(parseInt(a) - this.freqMap.get(parseInt(b)))
        }
        return this.cache[a].count - this.cache[b].count
      })

      let deletedVal = arr[0]
      if (deletedVal == key) {
        deletedVal = arr[1]
      }
      delete this.cache[deletedVal]
    }

    return result
  }

  Clear() {
    const size = Object.keys(this.cache).length
    this.cache = {}
    this.freqMap = new Map()
    this.counter = 1

    return size
  }

  Keys() {
    return Object.keys(this.cache)
  }
}

class InMemoryCache {
    constructor(limit, evictionManager) {
      if (evictionManager == none || !evictionManager) {
        return new NoneEvictionManager(limit)
      } else if (evictionManager == lru) {
        return new LRUEvictionManager(limit)
      } else if (evictionManager == lfu) {
        return new LFUEvictionManager(limit)
      }
    }
}

module.exports = InMemoryCache
