'use strict'

import compose, { Context, MiddlewareFunction, NextFunction } from '@art-of-coding/lime-compose'

export class Lime<C = Context> {
  private _stack: MiddlewareFunction<C>[] = []
  private _composed: MiddlewareFunction<C>

  public use (...middlewares: MiddlewareFunction<C>[]) {
    if (!middlewares.length) {
      throw new TypeError('use() expects at least one argument')
    }

    for (let middleware of middlewares) {
      this._stack.push(middleware)
    }

    this._composed = null

    return this
  }

  public compose () {
    if (!this._composed) {
      this._composed = compose<C>(...this._stack)
    }

    return this._composed
  }

  public async run (ctx: C, next?: NextFunction) {
    return this.compose()(ctx, next)
  }
}

export default Lime
