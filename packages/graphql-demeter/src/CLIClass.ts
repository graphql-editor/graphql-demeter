import { runMockServer } from '@/server.js';
import { FakerConfig } from 'graphql-demeter-core';
import { join } from 'node:path';
import * as fs from 'fs';
/**
 * basic yargs interface
 */
interface Yargs {
  [x: string]: unknown;
  url: string | undefined;
  config: string | undefined;
  _: (string | number)[];
  $0: string;
}

/**
 * Interface for yargs arguments
 */
type CliArgs = Yargs;
/**
 * Main class for controlling CLI
 */
export class CLI {
  static getConfig = async (configPath: string): Promise<FakerConfig> => {
    const fullConfigPath = join(process.cwd(), configPath);
    const configExists = fs.existsSync(fullConfigPath);
    if (!configExists) {
      fs.writeFileSync(
        fullConfigPath,
        `const config = {
  objects: {},
  scalars: {},
  alwaysRequired: false,
};
module.exports = config`,
      );
    }

    return import(fullConfigPath).then((d) => d.default);
  };
  /**
   *  Execute yargs provided args
   */
  static execute = async <T extends CliArgs>(args: T): Promise<void> => {
    if (args.url) {
      // do smth
    }
    const allArgs = args._ as string[];
    const schemaFile = allArgs[0];
    if (!schemaFile) {
      throw new Error('First argument should be path to the schema file');
    }
    const schemaFileContent = fs.readFileSync(schemaFile, 'utf-8');
    const configPath = args.config || CONFIG;
    const configFile = await CLI.getConfig(configPath);
    runMockServer(schemaFileContent, configFile);
  };
}

const CONFIG = '.graphql.demeter.js';
