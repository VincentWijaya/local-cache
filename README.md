##Installation
```bash
npm install
```

##Test
```bash
npm run test
```

## Usage

#### Example

```js
const Cache = require("./index.js")

/* Construct a new cache can receive 2 params (limit, evictionManager)
   manager: NoneEvictionManager, LRUEvictionManager, LFUEvictionManager
   default manager is none
*/
const cache = new Cache(5)

cache.set("key", "value")
const cacheData = cache.get("key")
console.log(cacheData)
```