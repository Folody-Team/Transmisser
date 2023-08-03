import {fork} from 'child_process';
import {Electron} from './module/app'
import path from 'path';

const app = new Electron(() => fork(path.join(__dirname, './server.js')));

app.init({ preload: path.join(__dirname, './preload.js') });