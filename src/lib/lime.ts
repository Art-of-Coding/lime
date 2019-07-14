'use strict'

import compose from './compose'

export interface Context {
  [x: string]: any
}

export interface MiddlewareFunction<C = Context> {
  (ctx: C, next?: () => Promise<void>): Promise<void>
}

export class Lime<C = Context> {
  private _mw: MiddlewareFunction<C>[] = []

  public use (fn: MiddlewareFunction<C>) {
    this._mw.push(fn)
  }

  public compose () {
    return compose(this._mw)
  }

  public async run (ctx: C) {
    return this.compose()(ctx)
  }
}

export default Lime
