# Code Validation & Git Push Agent

## Purpose
Automate code validation, commit, and push workflow.

## Workflow Steps

### 1. Run Tests
- Execute all unit tests
- Command: `npm test` or `yarn test` or `npx playwright test`
- Check: All tests must pass

### 2. Build Check
- Compile/build the project
- Command: `npm run build` or similar
- Check: Build must succeed without errors

### 3. Linting (Optional)
- Run code quality checks
- Command: `npm run lint`
- Check: No critical errors

### 4. Git Operations (If all checks pass)

#### Stage changes
```bash
git add .
```

#### Commit with message
```bash
git commit -m "chore: all tests passed and code validated on [DATE]"
```

#### Push to remote
```bash
git push origin main
```

## Error Handling
- If **tests fail** → Stop, log error, do NOT push
- If **build fails** → Stop, log error, do NOT push
- If **lint fails** → Warn but can continue (configurable)
- If **git operations fail** → Stop and report

## Success Criteria
✅ All tests pass
✅ Build succeeds
✅ No blocking issues
✅ Git push completed
