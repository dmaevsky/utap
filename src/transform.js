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
  const subTests = [];
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

    const [, subDesc] = /^# Subtest: (.*)/.exec(line) || [];

    if (subDesc) {
      subTests.push(subDesc);
      return;
    }

    const [matched, failed, _, description, directive] =
      /^(not )?ok (\d+)(?: - ([^#]*))?(?:# (\w+))?/.exec(line) || [];

    if (!matched) return;

    const status = ({ skip: 'skipped', todo: 'todo' })[directive?.toLowerCase()] ||
      (failed ? 'failed' : 'passed');

    const spit = prefix[status] + color[status](suiteName + [...subTests, description].join('   ')) + '\n';

    ++counters[status];

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
    return '    ' + line + '\n';
  }

  for await (let line of source) {
    while (!line.startsWith(''.padStart(subTests.length * 4))) subTests.pop();
    line = line.slice(subTests.length * 4);

    const spit = eat(line);
    if (spit) yield spit;
  }

  yield '\n';

  for (let status in counters) {
    if (!counters[status]) continue;
    yield colorSummary[status](`${counters[status]} ${status}\n`);
  }
}
