import 'dotenv/config';
import {Client} from './Client';


const client = new Client();

client.register();
client.handlerCommand('commands');