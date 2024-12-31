
# Try-Catch-Retrier

Try-Catch-Retrier is a flexible utility for managing retry logic in asynchronous operations. This package allows you to retry functions with customizable settings like maximum attempts, delays, exponential backoff, and more. Perfect for ensuring resilience in critical operations.

---

## Features

- **Customizable Retry Logic**: Define maximum attempts, delays, exponential backoff, and more.
- **Dynamic Configuration**: Update retry settings dynamically during execution.
- **Built-in Logging**: Log retry attempts with detailed context.
- **TypeScript Support**: Fully typed for better developer experience.
- **Flexible API**: Includes a default retry function (`tcRetry`) and a customizable retrier creator (`createRetrier`).

---

## Installation

Install the package via npm:

```bash
npm install try-catch-retrier
```

---

## Usage

### Import the Package

```javascript
const { createRetrier, tcRetry } = require("try-catch-retrier");
// Or in TypeScript
// import { createRetrier, tcRetry } from "try-catch-retrier";
```

---

### Default Retry Function (`tcRetry`)

The `tcRetry` function provides retry capabilities with default settings.

```javascript
(async () => {
    const [result, errors] = await tcRetry(async () => {
        // Your operation here
        throw new Error("Failed attempt");
    });
    console.log("Result:", result);
    console.log("Errors:", errors);
})();
```

---

### Custom Retry Function (`createRetrier`)

Create a retry function with specific settings using `createRetrier`:

```javascript
const customRetry = createRetrier({
    maxAttempts: 5,
    delay: 2000,
    exponential: true,
    log: ({ title, attempt, error }) => {
        console.log(`${title} - Attempt ${attempt}: ${error?.message}`);
    },
});

(async () => {
    const [result, errors] = await customRetry(async () => {
        // Your operation here
        throw new Error("Failed attempt");
    });
    console.log("Result:", result);
    console.log("Errors:", errors);
})();
```

---

## Configuration Options

The following options are available for customizing the retry logic:

| Option        | Type       | Default           | Description                                                             |
| ------------- | ---------- | ----------------- | ----------------------------------------------------------------------- |
| `maxAttempts` | `number`   | `3`               | Maximum number of retry attempts. Must be greater than 0.               |
| `delay`       | `number`   | `1000`            | Delay (in milliseconds) between retries.                                |
| `exponential` | `boolean`  | `true`            | Whether to use exponential backoff for retries.                         |
| `retryOn`     | `function` | Always retry      | Function to determine if a retry should occur based on error or result. |
| `log`         | `function` | No logging        | Function to log retry attempts.                                         |
| `title`       | `string`   | `"Retry Attempt"` | Title for logging purposes.                                             |

---

## Example Use Cases

### 1. Simple Retry

```javascript
await tcRetry(() => {
    throw new Error("Operation failed");
});
```

---

### 2. Custom Retry Logic

```javascript
const customRetry = createRetrier({
    maxAttempts: 4,
    delay: 500,
    retryOn: ({ error }) => !!error, // Retry only if there's an error
});
await customRetry(() => {
    // Your operation here
});
```

---

### 3. Logging Retry Attempts

```javascript
const loggingRetry = createRetrier({
    maxAttempts: 3,
    log: ({ title, attempt, error }) => {
        console.log(`${title} - Attempt ${attempt}: ${error?.message}`);
    },
});
await loggingRetry(() => {
    throw new Error("Log this!");
});
```

---

## API

### `tcRetry(cb: Function, options?: TryCatchRetrierOptions): Promise<[result: any, errors: TryCatchRetrierErrors]>`

A default retry function with customizable logic.

#### Parameters:
- `cb` - The callback function to execute. Should return a value or a promise.
- `options` - Configuration options for the retry logic (overrides defaults).

#### Returns:
A promise resolving to:
1. `result` - The final successful result (if any).
2. `errors` - An array of errors for each failed attempt.

---

### `createRetrier(options?: TryCatchRetrierOptions): Function`

Creates a custom retry function with specified settings.

#### Parameters:
- `options` - Configuration options for the retry logic.

#### Returns:
A retry function with the same behavior as `tcRetry`.

---

## Changelog

### v1.0.0
- Initial release of `try-catch-retrier`.
- Added `tcRetry` as a default retry function.
- Added `createRetrier` for custom retry configurations.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Author

codebyolan
golfbyolan
olan88
Fredrik Olander