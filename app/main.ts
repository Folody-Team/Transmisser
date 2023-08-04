import {fork} from 'child_process';
import {Electron} from './module/app'
import path from 'path';

const app = new Electron(() => process.env.NODE_ENV == 'development' ? '' : fork(path.join(__dirname, './server.js')));

app.init({ preload: path.join(__dirname, './preload.js') });