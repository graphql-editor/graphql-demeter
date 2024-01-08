#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CLI } from '@/CLIClass.js';
const args = await yargs(hideBin(process.argv))
  .usage(
    `
GraphQL Demeter 🌾
GraphQL most advanced mock server

Load from file or url (url must start with http:// or https:// ):
demeter [path] [output_path] [options]
`,
  )
  .option('url', {
    alias: 'u',
    describe: 'Get schema in-memory from url',
    type: 'string',
  })
  .demandCommand(1).argv;
CLI.execute(args);
