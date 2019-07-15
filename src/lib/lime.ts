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
  private _composed: (ctx: Context) => Promise<void>

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
      this._composed = compose(...this._stack)
    }

    return this._composed
  }

  public async run (ctx: C) {
    return this.compose()(ctx)
  }
}

export default Lime
