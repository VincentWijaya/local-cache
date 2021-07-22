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
const Cache = require("cache")
const cache = new Cache(5)

cache.set("key", "value")
const cacheData = cache.get("key")
console.log(cacheData)
```