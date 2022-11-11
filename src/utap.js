#!/usr/bin/node
import { pipeline } from 'node:stream/promises';
import * as readline from 'node:readline/promises';
import process from 'node:process';

import { transform } from './transform.js';

const rl = readline.createInterface({ input: process.stdin });

pipeline(rl, transform, process.stdout);
