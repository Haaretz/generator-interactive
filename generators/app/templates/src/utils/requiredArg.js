/**
 * Throw an informative error if required argument isn't provided to a function
 * ------------
 *  @param {string} [arg]
 *    The name of the required argument, so that it can be included in the error
 * ------------
 *  @throws An error message notifying user of the missing required argument
 * ------------
 *  @example
 *  function foo(bar = requiredArg('bar')) { ... }
 *  foo(); // -> throws `Missing argument (bar).` with a stack trace
 *         //    pointing to `foo`
 */
export default function requiredArg(arg) {
  const error = new Error(`Missing argument${arg ? ` (${arg})` : ''}.`);
  // Remove `requiredArg` from the error stack. Only supported in v8
  if (Error.captureStackTrace) Error.captureStackTrace(error, requiredArg);

  throw error;
}
