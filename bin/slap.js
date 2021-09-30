#!/usr/bin/env node

async function run() {
  try {
    const runCli = require('../src/cli')
    await runCli();
  } catch(ex) {
    console.log(ex)
  }
}

run()