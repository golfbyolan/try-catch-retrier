/**
 * A custom error class for handling retry logic, extending the built-in Error class.
 */
export class TryCatchError extends Error {
    public attempt: number;

    /**
     * Creates an instance of TryCatchError.
     * @param {string} message - The error message.
     * @param {number} attempt - The retry attempt during which the error occurred.
     */
    constructor(message: string, attempt: number) {
        super(message); // Call the parent class constructor
        this.name = "TryCatchError"; // Set the name of the error
        this.attempt = attempt;

        // Maintains proper stack trace for where the error was thrown (only available in V8 engines like Node.js)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TryCatchError);
        }
    }
}

/**
 * A type representing an array of TryCatchError instances.
 */
export type TryCatchRetrierErrors = TryCatchError[];