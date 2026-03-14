# Jones Automation - Thompson Raul dos Santos Vieira

## Features

- Automated form filling (name, email, phone, company, employees).
- Multiple validation scenarios:
  - valid submission
  - invalid email
  - empty required fields
- Automatic detection of successful submission through navigation to
  the **Thank You page**.
- Screenshots saved for every test execution:
  - `screenshots/success/` → successful submissions
  - `screenshots/failure/` → validation failures
  - `screenshots/exception/` → unexpected errors
- Structured logging of each test case in the console.

---

## Project Structure

    project/
    │
    ├── index.js              → Main automation script and test runner
    ├── package.json
    │
    └── screenshots/
        ├── success/          → Screenshots for successful submissions
        ├── failure/          → Screenshots for failed tests
        └── exception/        → Screenshots for unexpected errors

---

## Setup

Install dependencies:

```bash
npm install puppeteer
```

---

## Run Tests

Execute the automation script:

```bash
node index.js
```

---

## Test Scenarios

The script runs several test cases automatically:

- **valid-test** → all fields filled correctly
- **invalid-email** → invalid email format
- **empty-name** → missing name
- **empty-phone** → missing phone number
- **empty-company** → missing company name

---

## Output

- Console logs show the result of each test case.
- Successful submissions are stored in:

```

    screenshots/success/
```

- Failed validations are stored in:

```

    screenshots/failure/
```

- Unexpected script errors are stored in:

```

    screenshots/exception/
```

---
