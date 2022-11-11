# μtap
A micro TAP formatter that works very well with the Node >=18 built-in [`node:test`](https://nodejs.org/docs/latest-v18.x/api/test.html) harness.
- The output format is inspired by [`AVA`](https://github.com/avajs/ava).
- Less than 100 lines of code, and a single [`chalk`](https://www.npmjs.com/package/chalk) dependency.

```
npm install --save-dev utap
```

Put your tests in `tests/` directory (or wherever you like really)

In your `package.json`:

```js
  "scripts": {
    "test": "find tests -type f -name '*.test.js' -exec echo \\# utap-src:{} \\; -exec node {} \\; | utap"
  },
```

Adding the `# utap-src:{filename}` comment in between individual test files' TAP output allows `utap` to report the *filename* together with test descriptions. Remove that part if you don't need it.

```
npm test
```

### Note
I am not using the built-in `node --test` runner on purpose to allow for more flexibility.
