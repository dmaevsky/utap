import assert from 'node:assert/strict';
import chalk from 'chalk';

const color = {
  passed: i => i,
  failed: chalk.red,
  skipped: chalk.hex('#FF8800'),
  todo: chalk.blue,
}

const colorSummary = {
  ...color,
  passed: chalk.green
}

const prefix = {
  passed: '  ✔  ',
  failed: '  ❌ ',
  skipped: color.skipped('   - '),
  todo: color.todo('   - '),
}

export async function* transform(source) {
  let eat = testPoint;

  const counters = { passed: 0, failed: 0, skipped: 0, todo: 0 };
  let total = 0;
  let suiteName = '';

  function testPoint(line) {
    const [, filename] = /^# utap-src:([\S]+)/.exec(line) || [];
    if (filename) {
      suiteName = filename.slice(filename.indexOf('/') + 1);

      if (/\.(test|spec)\.js$/.test(suiteName)) {
        suiteName = suiteName.slice(0, -8);
      }
      suiteName += '   ';
      return;
    }

    const [, planned] = /^1\.\.([\d]+)/.exec(line) || [];
    if (planned) {
      assert.equal(+planned, total);
      total = 0;
      suiteName = '';
      return;
    }

    const [matched, failed, _, description, directive] =
      /^(not )?ok (\d+)(?: - ([^#]*))?(?:# (\w+))?/.exec(line) || [];

    if (!matched) return;

    const status = ({ skip: 'skipped', todo: 'todo'})[directive?.toLowerCase()] ||
      (failed ? 'failed' : 'passed');

    const spit = prefix[status] + color[status](suiteName + description) + '\n';

    ++counters[status];
    ++total;

    if (status === 'failed') eat = yamlStart;
    return spit;
  }

  function yamlStart(line) {
    assert(/^  ---[\s]*$/.test(line));
    eat = yaml;
  }

  function yaml(line) {
    if (/^  \.\.\.[\s]*$/.test(line)) {
      eat = testPoint;
      return;
    }
    return '\t' + line + '\n';
  }

  for await (let line of source) {
    const spit = eat(line);
    if (spit) yield spit;
  }

  yield '\n';

  for (let status in counters) {
    if (!counters[status]) continue;
    yield colorSummary[status](`${counters[status]} ${status}\n`);
  }
}
