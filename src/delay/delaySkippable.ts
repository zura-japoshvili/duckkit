/**
 * Pauses execution but can be cut short if a condition becomes true.
 *
 * Polls the condition every `pollInterval` ms. If it returns `true`
 * before the delay expires, the promise resolves immediately.
 * If the full duration passes, resolves normally regardless.
 *
 * Useful for animations and loading states where the user or game logic
 * can signal that the wait should end early.
 *
 * @param ms - Maximum duration to wait in milliseconds
 * @param condition - Function that returns `true` to skip the remaining delay
 * @param pollInterval - How often to check the condition in ms (default: 50)
 * @returns A promise that resolves when done or skipped
 *
 * @example
 * let skip = false
 * await delaySkippable(3000, () => skip)
 * // resolves after 3s, or instantly when skip = true
 *
 * @example
 * // Skip when user clicks
 * let skipped = false
 * document.addEventListener('click', () => { skipped = true })
 * await delaySkippable(5000, () => skipped)
 */
export function delaySkippable(
  ms: number,
  condition: () => boolean,
  pollInterval: number = 50
): Promise<void> {
  return new Promise(resolve => {
    if (condition()) {
      resolve()
      return
    }

    const timer = setTimeout(() => {
      clearInterval(poll)
      resolve()
    }, ms)

    const poll = setInterval(() => {
      if (condition()) {
        clearTimeout(timer)
        clearInterval(poll)
        resolve()
      }
    }, pollInterval)
  })
}