# Lime

A small middleware package that uses ***async/await***, ~~heavily inspired~~ almost
verbatim copied from [koa](https://github.com/koajs/koa).

## Install

```
npm i @art-of-coding/lime
```

## API

#### app = new Lime<C = Context>(...middlewares: MiddlewareFunction[]): Lime

Create a new Lime app instance.

```ts
// with default context ({ [x: string]: string | number })
const app = new Lime()

// Create custom context interface
interface MyContext extends Context {
  age: number
}

const app = new Lime<MyContext>()
```

#### app.use(...middlewares: MiddlewareFunction[]): void

Add one or more middleware functions to the stack.

```ts
app.use(async (ctx, next) => {
  // middleware content here
})
```

#### app.compose(): (ctx: C) => Promise<void>

Composes the middleware stack into a callable function.

#### app.run (ctx: C): Promise<void>

Compose and run the middleware stack.

Shorthand for

```ts
const ctx = { /* ... */ }
const composed = app.compose()

await composed(ctx)
```

## Example

Also see [http-example.ts](src/examples/http-example.ts) for a more complete, practical
example.

```ts
import Lime from '@art-of-coding/lime'

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
