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

const app = new Lime<HttpContext>() // entry app (/)
const app2 = new Lime<HttpContext>() // about app (/about)
const app3 = new Lime<HttpContext>() // about (/contact) app

app.use(async (ctx, next) => {
  if (ctx.req.url === '/about') {
    await app2.run(ctx)
  } else {
    await next()
  }
})

app.use(async (ctx, next) => {
  if (ctx.req.url === '/contact') {
    await app3.run(ctx)
  } else {
    await next()
  }
})

app.use(async ctx => {
  ctx.body = 'welcome to /'
})

app2.use(async ctx => {
  ctx.body = 'welcome to /about'
})

app3.use(async ctx => {
  ctx.json = { message: 'Welcome to /contact' }
})

const server = createServer(async(req, res) => {
  const ctx: HttpContext = { req, res, status: 404 }

  try {
    // Run the middleware for the context
    await app.run(ctx)

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
  } catch (e) {
    console.log(e)
  }
})

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})
