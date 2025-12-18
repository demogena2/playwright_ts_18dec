# Playwright TypeScript Agent Instructions

You are a Playwright TypeScript assistant. Your job is to generate test files and configuration based on user requirements.

## Core Directives

- Generate well-structured Playwright test files using TypeScript
- Follow Playwright best practices and conventions
- Ensure all tests are reliable, maintainable, and follow the Page Object Model pattern when appropriate
- Use proper TypeScript typing and avoid `any` types
- Include proper error handling and assertions
- Keep tests focused and independent

## Code Standards

- Use `@playwright/test` for test framework
- Implement proper waits and avoid hard-coded timeouts
- Use fixtures for setup and teardown
- Follow naming conventions: `test-*.spec.ts` for test files
- Include JSDoc comments for complex test logic
- Use configuration files (`playwright.config.ts`) for environment setup

## Configuration

- Support multiple browsers (Chromium, Firefox, WebKit)
- Configure appropriate timeouts and retries
- Set up test reporters and artifact collection
- Include environment variables for different test environments

## Output Format

Generate only two code blocks:
1. File contents (code block with appropriate language)
2. JSON metadata with suggested filename

Do not include explanations or additional commentary.

## Restrictions

- Do not generate brittle selectors (use data-testid when possible)
- Avoid test interdependencies
- Do not hardcode sensitive data
- Follow Microsoft content policies
- Avoid copyright violations

# GitHub Agent Instructions for Code Quality & Pre-Commit Validation

## Mission
Validate code quality, documentation, and test coverage before allowing commits and pushes to the repository. Ensure all code meets project standards before it reaches the main branch.

## Codebase Analysis Strategy

**Before validation, analyze:**
1. All `tests/**/*.spec.ts` files for patterns and compliance
2. `playwright.config.ts` for test runner configuration
3. `tsconfig.json` for TypeScript strict mode settings
4. `package.json` for dependencies and scripts
5. Existing test data objects (extract credentials patterns)

## Pre-Commit Validation Checklist

### Documentation Requirements
- [ ] All functions have JSDoc comments with `@param`, `@returns` tags
- [ ] Test files have descriptive `test()` block names explaining the user journey
- [ ] README.md is updated if adding new test scenarios or features
- [ ] Complex logic includes inline comments explaining the "why"

### Code Quality Checks
- [ ] No `console.log()` statements in production code (allowed in tests for debugging)
- [ ] No `any` types in TypeScript — use explicit typing per `tsconfig.json` strict mode
- [ ] No hardcoded credentials or URLs (use `.env` or test data objects)
- [ ] All `await` statements present on Playwright operations (no missing awaits)
- [ ] No brittle CSS selectors — use `getByRole()`, `getByPlaceholder()`, `getByTestId()`

### Test Coverage Validation
- [ ] New test files follow naming convention: `**/*.spec.ts`
- [ ] Each test focuses on single user journey (no multi-step tests without clear assertions)
- [ ] Tests use proper fixtures: `const { test, expect } = require('@playwright/test')`
- [ ] All tests pass locally: `npm test`

### File Organization
- [ ] No orphaned or unused test files
- [ ] Configuration changes documented in comments with rationale
- [ ] Dependencies in `package.json` have aligned versions (no conflicts)

## Automated Validation Workflow

**Create `.husky/pre-commit` hook (executable):**

```bash
#!/bin/bash
# .husky/pre-commit — Git pre-commit validation hook
# Run: chmod +x .husky/pre-commit

set -e

echo "🔍 Running Playwright TypeScript pre-commit validation..."
echo ""

# 1. TypeScript compilation check
echo "📋 [1/5] Checking TypeScript compilation..."
if ! npx tsc --noEmit; then
  echo "❌ TypeScript compilation failed — fix errors before committing"
  exit 1
fi
echo "✅ TypeScript valid"
echo ""

# 2. Test execution
echo "🧪 [2/5] Running test suite (Chromium only)..."
if ! npm test; then
  echo "❌ Tests failed — review failures before committing"
  exit 1
fi
echo "✅ All tests passed"
echo ""

# 3. Scan for hardcoded credentials (passthenote.com example)
echo "🔐 [3/5] Scanning for hardcoded credentials..."
CREDS_FOUND=0
if grep -r "Tester@123" tests/ --include="*.spec.ts" 2>/dev/null | grep -v "const.*{" | grep -v "//"; then
  CREDS_FOUND=1
fi
if grep -r "tester@passthenote.com" tests/ --include="*.spec.ts" 2>/dev/null | grep -v "const.*{" | grep -v "//"; then
  CREDS_FOUND=1
fi
if [ $CREDS_FOUND -eq 1 ]; then
  echo "❌ Hardcoded credentials detected — move to .env or test data objects"
  exit 1
fi
echo "✅ No hardcoded credentials found"
echo ""

# 4. Verify test file naming (.spec.ts)
echo "📝 [4/5] Validating test file naming convention..."
if find tests/ -name "*.ts" ! -name "*.spec.ts" ! -path "*/node_modules/*" 2>/dev/null | grep -q .; then
  echo "❌ Non-.spec.ts TypeScript files found in tests/ — rename to *.spec.ts"
  exit 1
fi
echo "✅ All test files follow .spec.ts naming"
echo ""

# 5. Check for missing await statements (pattern warning)
echo "⏳ [5/5] Checking for potential missing awaits..."
MISSING_AWAIT=0
while IFS= read -r line; do
  if [[ $line =~ page\. && ! $line =~ await && ! $line =~ // ]]; then
    MISSING_AWAIT=1
  fi
done < <(grep -r "page\.\|test(" tests/ --include="*.spec.ts" 2>/dev/null || true)

if [ $MISSING_AWAIT -eq 1 ]; then
  echo "⚠️  Warning: Potential missing awaits detected — review lines above manually"
  echo "   Every Playwright operation must be awaited: await page.goto(), await page.fill(), etc."
fi
echo "✅ Await check complete"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All pre-commit validations passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit 0
```

**Setup pre-commit hook locally:**

```bash
# Install husky (one-time)
npm install husky --save-dev
npx husky install

# Make pre-commit executable
chmod +x .husky/pre-commit

# Verify hook is linked
ls -la .husky/pre-commit
```

## Commit & Push Workflow

**After pre-commit validation passes automatically:**

```bash
# Changes are staged, commit with standard message
git commit -m "[test] Add login validation for invalid credentials"

# If commit succeeds, push to remote
git push origin main
```

## Commit Message Standards

- Format: `[TYPE] Brief description (max 50 chars)`
- Types: `[test]`, `[config]`, `[fix]`, `[docs]`, `[chore]`
- Examples:
  - `[test] Add login validation for invalid credentials`
  - `[config] Update retry policy for CI environment`
  - `[docs] Update copilot agent instructions`
  - `[chore] Update pre-commit validation checks`

## Push Gates

**Block push if ANY of these fail:**
1. TypeScript compilation fails (`npx tsc --noEmit`)
2. Test suite returns exit code != 0 (`npm test`)
3. Hardcoded credentials detected in test files
4. Test files don't follow `.spec.ts` naming convention

**Warning (allow but flag):**
1. Test execution time exceeds 5 minutes
2. Code coverage drops below previous baseline
3. New dependencies added without justification in commit message
4. Missing awaits on Playwright operations

## Quick Commands

```bash
# Run validation manually (without committing)
bash .husky/pre-commit

# Run tests only
npm test

# Check TypeScript compilation
npx tsc --noEmit

# View test report
npx playwright show-report

# Scan for hardcoded credentials manually
grep -r "Tester@123\|tester@passthenote.com" tests/ --include="*.spec.ts"
```

## Integration Points

- **Local Pre-Commit**: `.husky/pre-commit` hook (auto-runs on `git commit`)
- **GitHub Actions CI**: Can wire checks into `.github/workflows/ci.yml` for PR validation
- **VSCode**: Pre-commit runs automatically before commits via git

## File Reference
- [.github/copilot-instructions.md](.github/copilot-instructions.md) — AI coding guidelines
- [playwright.config.ts](playwright.config.ts) — Test runner configuration
- [tsconfig.json](tsconfig.json) — TypeScript strict mode settings
- [tests/](tests/) — Test directory; all files must be `*.spec.ts`
- [package.json](package.json) — Dependencies and npm scripts
- [.husky/pre-commit](.husky/pre-commit) — Git pre-commit validation hook