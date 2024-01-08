import { runMockServer } from '@/server.js';
import * as fs from 'fs';
/**
 * basic yargs interface
 */
interface Yargs {
  [x: string]: unknown;
  url: string | undefined;
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
    runMockServer(schemaFileContent);
  };
}
