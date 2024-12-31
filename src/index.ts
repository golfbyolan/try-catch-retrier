import { TryCatchError, TryCatchRetrierErrors } from "./errors"
import { DefaultSettings, TryCatchRetrierOptions, TryCatchRetrierSettings, wait } from "./settings"

/**
 * Creates a retrier function with customizable retry logic.
 * 
 * @param {TryCatchRetrierOptions} [options={}] - Configuration options for the retrier. These include:
 * @param {number} [options.maxAttempts=3] - The maximum number of retry attempts. Must be greater than 0.
 * @param {number} [options.delay=1000] - The delay (in milliseconds) between retries. Must be a positive number.
 * @param {boolean} [options.exponential=true] - Whether to use exponential backoff for retries.
 * @param {function({ error: any, attempt: number, result: any }): boolean} [options.retryOn] - A function that determines whether to retry based on the error, attempt count, and result.
 * @param {function({ title: string, attempt: number, error: any, result: any }): void} [options.log] - A logging function to log retry attempts.
 * @param {string} [options.title="Retry Attempt"] - A title for logging and debugging retry attempts.
 * 
 * @returns {Function} A retrier function that takes a callback and additional retry-specific options.
 * The retrier function returns a `Promise` that resolves to a tuple: `[result, errors]`.
 */
export function createRetrier(options: TryCatchRetrierOptions = {}) {
    const defaultSettings = new DefaultSettings(options)

    const retrier = async function (cb: Function, options: TryCatchRetrierOptions = {}): TryCatchRetrierResult {
        const settings: TryCatchRetrierSettings = defaultSettings.update(options)
        let result: TryCatchRetrierData = null
        let errors: TryCatchRetrierErrors = [];
        let attempt = 0;

        while (!result && attempt < settings.maxAttempts) {
            attempt++;
            const delayThisAttempt: number = attempt === 1 ? 0 : settings.exponential ? Math.pow(2, attempt - 2) * settings.delay : settings.delay;
            await wait(delayThisAttempt);
            try {
                result = await cb();
            } catch (err) {
                const error = err as Error
                errors.push(new TryCatchError(error?.message || "Unknown error", attempt))
            }
            if (!settings.retryOn({ error: errors[attempt - 1], attempt, result })) break;
            settings.log({ title: settings.title, result, attempt, error: errors[attempt - 1] });
        }

        return [result, errors];
    }

    retrier.settings = defaultSettings

    return retrier
}


/**
 * Executes a function with retry logic based on the provided and default settings.
 * 
 * @param {Function} cb - The callback function to execute with retries. Should return a promise or a value.
 * @param {TryCatchRetrierOptions} [options={}] - Options to override default retry settings for this execution. These include:
 * @param {number} [options.maxAttempts=3] - The maximum number of retry attempts. Must be greater than 0.
 * @param {number} [options.delay=1000] - The delay (in milliseconds) between retries. Must be a positive number.
 * @param {boolean} [options.exponential=true] - Whether to use exponential backoff for retries.
 * @param {function({ error: any, attempt: number, result: any }): boolean} [options.retryOn] - A function to determine whether to retry based on the error, attempt count, and result.
 * @param {function({ title: string, attempt: number, error: any, result: any }): void} [options.log] - A logging function to track and log retry attempts.
 * @param {string} [options.title="Retry Attempt"] - A title for logging and debugging retry attempts.
 * 
 * @returns {TryCatchRetrierResult} A promise that resolves to a tuple containing the result and an array of errors.
 * - `result` is the value returned by the callback if it succeeds.
 * - `errors` is an array of `TryCatchError` instances, one for each failed attempt.
 */
export const tcRetry = createRetrier()

type TryCatchRetrierResult = Promise<[TryCatchRetrierData, TryCatchRetrierErrors]>;
type TryCatchRetrierData = any