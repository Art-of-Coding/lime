'use strict'

import compose from './compose'

export interface Context {
  [x: string]: any
}

export interface MiddlewareFunction<C = Context> {
  (ctx: C, next?: () => Promise<void>): Promise<void>
}

export class Lime<C = Context> {
  private _composed: (ctx: Context) => Promise<void>
  private _mw: MiddlewareFunction<C>[] = []

  public use (fns: MiddlewareFunction<C> | MiddlewareFunction<C>[]) {
    if (Array.isArray(fns)) {
      for (let fn of fns) {
        this._mw.push(fn)
      }
    } else {
      this._mw.push(fns)
    }

    this._composed = null
  }

  public compose () {
    if (!this._composed) {
      this._composed = compose(this._mw)
    }

    return this._composed
  }

  public async run (ctx: C) {
    return this.compose()(ctx)
  }
}

export default Lime
