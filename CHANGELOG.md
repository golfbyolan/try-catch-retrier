
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - Initial Release
### Added
- Default retry function (`tcRetry`) with standard settings for asynchronous retries.
- `createRetrier` function to create custom retry logic.
- Support for customizable retry options:
  - `maxAttempts`: Maximum number of retry attempts.
  - `delay`: Delay between retries (in milliseconds).
  - `exponential`: Use exponential backoff.
  - `retryOn`: Define conditions for retries.
  - `log`: Log retry attempts with details.
- TypeScript support with full type definitions.
- Robust error handling and detailed logging capabilities.
