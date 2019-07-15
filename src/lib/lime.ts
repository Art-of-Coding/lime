'use strict'

import compose from './compose'

export interface Context {
  [x: string]: any
}

export interface MiddlewareFunction<C = Context> {
  (ctx: C, next?: () => Promise<void>): Promise<void>
}

export class Lime<C = Context> {
  private _stack: MiddlewareFunction<C>[] = []
  private _composed: (ctx: C, next?: () => Promise<void>) => Promise<void>

  public use (...middlewares: MiddlewareFunction<C>[]) {
    if (!middlewares.length) {
      throw new TypeError('use() expects at least one argument')
    }

    for (let middleware of middlewares) {
      if (typeof middleware !== 'function') {
        throw new TypeError('use() expects arguments to be functions')
      }

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

  public async run (ctx: C, next?: () => Promise<void>) {
    return this.compose()(ctx, next)
  }
}

export default Lime
