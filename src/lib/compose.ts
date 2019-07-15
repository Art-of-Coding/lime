'use strict'

import { MiddlewareFunction, Context } from './lime'

export function compose (...stack: MiddlewareFunction<any>[]) {
  return (ctx: Context, next?: () => Promise<void>) => {
    let index = -1

    const dispatch = async (i: number) => {
      if (i <= index) {
        throw new Error('next() called multiple times')
      }

      index = i
      let fn = stack[i]
      if (i === stack.length) {
        fn = next
      }

      if (fn) {
        await fn(ctx, () => dispatch(i + 1))
      }
    }

    return dispatch(0)
  }
}

export default compose
