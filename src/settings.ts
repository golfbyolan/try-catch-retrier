export const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export class DefaultSettings {
    title: string = "Try Catch Retrier"
    maxAttempts: number = 1
    delay: number = 100
    exponential: boolean = true
    retryOn: TryCatchOnRetrierFunction = function () { return true }
    log: TryCatchLoggingFunction = function () { }
    
    constructor(options: TryCatchRetrierOptions = {}) {
        this.update(options)
    }

    update(options: TryCatchRetrierOptions = {}) {
        this.validate(options);
        for (const key in options) {
            const value = options[key as keyof TryCatchRetrierOptions];
            if (value !== undefined) {
                (this as any)[key] = value;
            }
        };
        return this;
    }

    validate(options: TryCatchRetrierOptions) {
        if (options.maxAttempts !== undefined && options.maxAttempts <= 0) {
            throw new Error("maxAttempts must be greater than 0");
        }
    
        if (options.delay !== undefined && options.delay < 0) {
            throw new Error("delay must be a positive number");
        }
    
        if (options.exponential !== undefined && typeof options.exponential !== 'boolean') {
            throw new Error("exponential must be a boolean");
        }
    
        if (options.retryOn !== undefined && typeof options.retryOn !== 'function') {
            throw new Error("retryOn must be a function that returns a boolean");
        }
    
        if (options.log !== undefined && typeof options.log !== 'function') {
            throw new Error("log must be a function");
        }
    
        if (options.title !== undefined && typeof options.title !== 'string') {
            throw new Error("title must be a string");
        }
    }
}

export class TryCatchRetrierError extends Error{
    attempt: number = 0
    constructor(message:string, attempt:number){
        super(message)
        this.attempt = attempt
    }
}

export interface TryCatchRetrierSettings {
    title: string
    maxAttempts: number,
    delay: number,
    exponential: boolean,
    retryOn: TryCatchOnRetrierFunction
    log: TryCatchLoggingFunction
}

export type TryCatchOnRetrierFunction = (props:OnRetryProperties) => boolean
export type TryCatchLoggingFunction = (props:LoggingProperties) => void


interface LoggingProperties {
    title?: string
    result?: any
    attempt?: number
    error?: any
}

interface OnRetryProperties {
    result?: any
    attempt?: number
    error?: any
}

export type TryCatchRetrierOptions = Partial<TryCatchRetrierSettings>
