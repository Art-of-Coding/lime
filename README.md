# Lime

A small middleware package that uses ***async/await***, ~~heavily inspired~~ almost
verbatim copied from [koa](https://github.com/koajs/koa).

## Install

```
npm i @art-of-coding/lime
```

## API

*TBD*

## Example

```ts
import Lime from '@ArtofCoding/lime'

// Create a new Lime app
const app = new Lime()

// Add middleware function
app.use(async (ctx, next) => {
  ctx.no = 1
  // Run through the rest of the stack
  await next()
})

app.use(async ctx => {
  ctx.middleware = true
  // no next() here
})

// Create a context
const ctx = {}

// Run the middlewares for the context
app.run(ctx).then(() => {
  /*
  `ctx` will now look something like this:
  
  {
    no: 1,
    middleware: true
  }
   */
  console.log(ctx)
}).catch(err => {
  console.error(err)
})
```

### License

Copyright 2016 [Michiel van der Velde](http://www.michielvdvelde.nl).

This software is licensed under the [MIT License](LICENSE).
