# μtap

> [!WARNING]
> **Deprecated.** Since Node 20, the built-in [`node:test`](https://nodejs.org/docs/latest/api/test.html) runner ships with a human-readable [`spec` reporter](https://nodejs.org/docs/latest/api/test.html#test-reporters), which is the default when writing to a terminal (`node --test`, or `node --test-reporter=spec my.test.js`). You probably don't need μtap anymore. It will keep working, but it is no longer actively developed.

A micro TAP formatter that works very well with the Node >=22 built-in [`node:test`](https://nodejs.org/docs/latest-v22.x/api/test.html) harness.
- The output format is inspired by [`AVA`](https://github.com/avajs/ava).
- Less than 100 lines of code, and a single [`chalk`](https://www.npmjs.com/package/chalk) dependency.

![Example output](screenshots/lorem_cast_1.gif)

### Give it a try
```
node my.test.js | npx utap
```

### Use it in your project
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
