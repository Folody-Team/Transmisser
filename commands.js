import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';


// Simple test command
const TEST_COMMAND = {
  name: 'download_youtube',
  description: 'Youtube video downloader',
  options: [
    {
      type: 3,
      name: 'input',
      description: 'Enter youtube url',
      required: true,
    },
  ],
  type: 1,
};



const ALL_COMMANDS = [TEST_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);