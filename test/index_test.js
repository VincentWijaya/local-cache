const test = require('tap').test
const Cache = require('../')

test('NoneEvictionManager', (t) => {
  const cache = new Cache(2)

  t.equal(cache.Add('key1', 'value1'), 0) // return 1
  t.equal(cache.Add('key2', 'value2'), 0) // return 0
  t.equal(cache.Add('key2', 'value2.1'), 1) // return 1

  t.equal(cache.Get('key1'), 'value1') // return value1

  t.same(cache.Keys(), ['key1', 'key2']) // return ['key1', 'key2']
  t.type(cache.Keys(), 'Array')
  t.same(cache.Keys().length, 2)

  t.throws(cache.Add('key4'), Error('key_limit_exceeded')) // return / throw Error('key_limit_exceeded')

  t.equal(cache.Clear(), 2) // return 2
  t.same(cache.Keys(), []) // return []
  t.same(cache.Keys().length, 0)

  t.end()
})

test('LRUEvictionManager', (t) => {
  const cache = new Cache(3, 'LRUEvictionManager')

  t.equal(cache.Add('key1', 'value1'), 0) // return 0
  t.equal(cache.Add('key2', 'value2'), 0) // return 0
  t.equal(cache.Add('key3', 'value3'), 0) // return 0
  t.equal(cache.Add('key2', 'value2.1'), 1) // return 1

  t.equal(cache.Get('key3'), 'value3') // return value3
  t.equal(cache.Get('key1'), 'value1') // return value1
  t.equal(cache.Get('key2'), 'value2.1') // return value2.1

  t.same(cache.Keys(), ['key3', 'key1', 'key2']) // return ['key3', 'key1', 'key2']
  t.equal(cache.Add('key4'), 0) // return 0
  t.same(cache.Keys(), ['key1', 'key2', 'key4']) // return ['key1', 'key2', 'key4']
  // (key 3 is the least recently used key, so when key4 added, we will remove key3 from cache)
  t.equal(cache.Clear(), 3) // return 3
  t.same(cache.Keys(), []) // return []

  cache.Add('key1', 'value1') // return 0
  cache.Add('key2', 'value2'), 0 // return 0
  cache.Add('key3', 'value3') // return 0
  t.same(cache.remove('key3'), ['key1', 'key2'])

  t.end()
})

test('LFUEvictionManager', (t) => {
  const cache = new Cache(3, 'LFUEvictionManager')

  t.equal(cache.Add('key1', 'value1'), 0) // return 0
  t.equal(cache.Add('key2', 'value2'), 0) // return 0
  t.equal(cache.Add('key3', 'value3'), 0) // return 0
  t.equal(cache.Add('key2', 'value2.1'), 1) // return 1

  t.equal(cache.Get('key3'), 'value3') // return value3
  t.equal(cache.Get('key1'), 'value1') // return value1
  t.equal(cache.Get('key2'), 'value2.1') // return value2.1
  t.equal(cache.Get('key3'), 'value3') // return value3
  t.equal(cache.Get('key1'), 'value1') // return value1

  t.same(cache.Keys(), ['key1', 'key2', 'key3']) // return ['key1', 'key2', 'key3']
  t.equal(cache.Add('key4'), 0) // return 0
  t.same(cache.Keys(), ['key1', 'key3', 'key4']) // return ['key1', 'key3', 'key4']
  t.equal(cache.Clear(), 3) // return 3
  t.same(cache.Keys(), []) // return []

  t.end()
})