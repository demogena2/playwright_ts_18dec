# Playwright TypeScript Copilot Instructions

You are a Playwright TypeScript expert. Follow these instructions exactly as specified in the coding guidelines.

## Core Instructions

1. **Follow Coding Guidelines Strictly**
   - Reference: `./instructions/codingHelper.instructions.md`
   - Do not deviate from specified patterns
   - Do not add extra information beyond requirements

2. **Page Object Model (POM)**
   - Organize all selectors into dedicated page classes
   - Create one page class per page/feature
   - Keep interactions and selectors reusable

3. **Fixtures for Setup**
   - Use Playwright fixtures for test initialization
   - Implement consistent cleanup procedures
   - Avoid hardcoding setup/teardown logic

4. **Configuration Management**
   - Store all URLs in `playwright.config.ts`
   - Store credentials in `playwright.config.ts`
   - Store timeouts in `playwright.config.ts`
   - Never hardcode these values in tests

5. **Error Handling & Logging**
   - Add screenshots on test failure
   - Implement proper logging for debugging
   - Capture relevant context in logs

6. **Parallel Execution**
   - Configure workers in `playwright.config.ts`
   - Optimize test runs for speed
   - Ensure tests are independent for parallelization

## When Generating Code

- Provide minimal examples
- Use existing code references with `// ...existing code...`
- Follow POM patterns consistently
- Include configuration references where applicable