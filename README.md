# Team Juicebox — E2E Testing of vr.fi with Playwright

> **Course Term Project** — End-to-end testing with Playwright  
> **Group:** Team Juicebox  
> **Target Website:** [vr.fi](https://www.vr.fi/en) — Finnish passenger railway service

---

## Project Overview

This repository contains automated end-to-end (E2E) tests built with [Playwright](https://playwright.dev/) targeting the public-facing website of VR (Finnish Railways) at `vr.fi`.

The goal is to investigate how reliably Playwright-based E2E tests can detect real and injected failures across multiple browsers and tech stacks.

---

## Tech Stacks

We test using **two different language stacks** to compare developer experience and reliability:

| Stack | Language | Runner | Config File |
|-------|----------|--------|-------------|
| Primary | TypeScript | `@playwright/test` | `playwright.config.ts` |
| Secondary | Python | `pytest-playwright` | `pytest.ini` |

---

## 🌐 Browsers Covered

All test suites are executed across three browser engines:

- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)

---
