'use strict'

import compose, { Middleware } from '@art-of-coding/compose'

export default class Application<TContext> {
  #stack: Middleware<TContext>[] = []
  #composed: Middleware<TContext>

  public use (...middlewares: Middleware<TContext>[]) {
    if (!middlewares.length) {
      throw new TypeError('use() expects at least one argument')
    }

    for (let middleware of middlewares) {
      this.#stack.push(middleware)
    }

    this.#composed = null
    return this
  }

  public compose () {
    if (!this.#composed) {
      this.#composed = compose(...this.#stack)
    }

    return this.#composed
  }

  public async run (ctx: TContext, next?: () => Promise<void>) {
    return this.compose()(ctx, next)
  }
}

export { default as compose, Middleware } from '@art-of-coding/compose'
