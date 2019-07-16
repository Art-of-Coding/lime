# Lime

A small middleware package that uses ***async/await***, ~~heavily inspired~~ almost
verbatim copied from [koa](https://github.com/koajs/koa).

## Install

```
npm i @art-of-coding/lime
```

## API

#### new Lime

```ts
new Lime<C = Context>(): Lime<C>
```

Create a new Lime app instance. The `C` key refers to the context definition to use,
which defaults to `Context ({ [x: string]: any })`.

```ts
import Lime, { Context } from '@art-of-coding/lime'

// with default context ({ [x: string]: any })
const app = new Lime()

// Create custom context interface
// Extending Context is not strictly necessary
interface MyContext extends Context {
  age: number
}

const app = new Lime<MyContext>()
// now the context will have a property definition <number>age
```

#### app.use()

```ts
app.use(...middlewares: MiddlewareFunction[]): this
```

Add one or more middleware functions to the stack.

A `MiddlewareFunction` is an async function that takes the `context (ctx)` for the
call as the first argument, and the `next()` function as the second. Calling `next()`
resumes calling of the middleware stack.

```ts
app.use(async (ctx, next) => {
  console.log('before next()')
  await next()
  console.log('after next()')
})
```

#### app.compose()

```ts
app.compose(): (ctx: C, next?: () => Promise<void>) => Promise<void>
```

Composes the middleware stack into a single middleware function.

Also see [@art-of-coding/lime-compose](https://github.com/Art-of-Coding/lime-compose)
for the stand-alone `compose` function.

```ts
const ctx = { /* ... */ }
const composed = app.compose()

composed(ctx).then(() => {
  // middleware completed
}).catch(err => {
  // middleware error
})
```

#### app.run()

```ts
app.run(ctx: C, next?: () => Promise<void>): Promise<void>
```

Compose and run the middleware stack.

```ts
const ctx = {}

app.run(ctx).then(() => {
  // middleware completed
}).catch(err => {
  // middleware error
})
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
  `ctx` will now look like this:
  
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

Copyright 2019 [Michiel van der Velde](http://www.michielvdvelde.nl).

This software is licensed under the [MIT License](LICENSE).
