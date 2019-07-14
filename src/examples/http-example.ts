'use strict'

import { Lime, Context } from '../'
import { createServer, IncomingMessage, ServerResponse } from 'http'

interface HttpContext extends Context {
  req: IncomingMessage,
  res: ServerResponse,
  status?: number,
  body?: string,
  json?: any
}

const app = new Lime<HttpContext>() // entry app
const app2 = new Lime<HttpContext>() // index (/) app
const app3 = new Lime<HttpContext>() // about (/about) app

app.use(async (ctx, next: Function) => {
  if (ctx.req.url === '/') {
    await app2.run(ctx)
  } else {
    await next()
  }
})

app.use(async (ctx, next: Function) => {
  if (ctx.req.url === '/about') {
    await app3.run(ctx)
  } else {
    await next()
  }
})

app2.use(async ctx => {
  ctx.body = 'welcome to /'
})

app3.use(async ctx => {
  ctx.json = { message: 'Welcome to /about' }
})

const server = createServer((req, res) => {
  const ctx: HttpContext = { req, res, status: 404 }

  app.run(ctx).then(() => {
    let contentType = 'text/plain'

    if (ctx.json) {
      try {
        ctx.body = JSON.stringify(ctx.json)
        contentType = 'application/json'
      } catch (e) {}
    }

    if (ctx.body) {
      ctx.status = ctx.status !== 404 ? ctx.status : 200
      ctx.res.writeHead(ctx.status, {
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(ctx.body)
      })

      res.write(ctx.body, () => res.end())
    } else {
      res.writeHead(ctx.status)
      res.end()
    }
  }).catch(err => {
    console.error(err)
  })
})

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})
