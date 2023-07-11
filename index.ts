// import 'dotenv/config';
// import {Client} from './Client';


// const client = new Client();

// client.register();
// client.handlerCommand('commands');


import {FFMPEG} from './lib/Transmisser/YoutubeDownload/ffmpeg'

const ffmpeg = new FFMPEG()
const data = ffmpeg.run()
console.log(data)