import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import ffmpeg from 'ffmpeg-static';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import crypto from 'crypto';
import cp from 'child_process';
import { EventEmitter } from 'events';
import archiver from 'archiver';
import { Express } from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';

import {Youtube} from '../lib/Transmisser/YoutubeDownload';

// function createDownload(url: string, session: EventEmitter, app: Express) {
//   var hasDownloaded = new EventEmitter()
//   const video = ytdl(url, { filter: 'videoonly', quality: 'highestvideo' });
//   const audio = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
//   const filename = crypto.randomBytes(20).toString('hex')
//   const urldown = `/download/${filename}`

//   const ffmpegProcess = cp.spawn(ffmpeg as string, [
//     '-i', `pipe:3`,
//     '-i', `pipe:4`,
//     '-map', '0:v',
//     '-map', '1:a',
//     '-c:v', 'copy',
//     '-c:a', 'libmp3lame',
//     '-crf', '27',
//     '-preset', 'veryfast',
//     '-movflags', 'frag_keyframe+empty_moov',
//     '-f', 'mp4',
//     '-loglevel', 'error',
//     '-'
//   ], {
//     stdio: [
//       'pipe', 'pipe', 'pipe', 'pipe', 'pipe',
//     ],
//   }) as any;

//   video.pipe(ffmpegProcess.stdio[3]);
//   audio.pipe(ffmpegProcess.stdio[4]);

//   let ffmpegLogs = ''

//   ffmpegProcess.stdio[2].on(
//     'data',
//     (chunk: { toString: () => string; }) => {
//       ffmpegLogs += chunk.toString()
//     }
//   )

//   ffmpegProcess.on(
//     'exit',
//     (exitCode: number) => {
//       if (exitCode === 1) {
//         console.error(ffmpegLogs)
//       }
//     }
//   )

//   app.get(urldown, (req, res) => {

//     res.writeHead(200, {
//       'Content-disposition': 'attachment;filename=' + `${filename}.mp4`,
//     });



//     ffmpegProcess.stdio[1].pipe(res.status(200))

//     session.emit('session', filename)
//     hasDownloaded.emit('downloaded');

//   })

//   hasDownloaded.on('downloaded', () => {

//     var routes = app._router.stack;
//     routes.forEach(removeMiddlewares);
//     function removeMiddlewares(route: { route: { path: string; }; }, i: any, routes: any[]) {
//       if (route.route) {
//         if (route.route.path) {
//           if (route.route.path == urldown) {
//             routes.splice(i, 1)
//           }
//         }
//       }

//     }

//     // hasDownloaded = null;


//   })

//   return `https://${process.env.host}${urldown}`

// }

// function createDownloadPlaylist(url: string, session: EventEmitter, app: Express) {
//   var hasDownloaded = new EventEmitter()
//   const filename = crypto.randomBytes(20).toString('hex')
//   const urldown = `/download/${filename}`;
//   const zipFile = archiver('zip', {
//     zlib: {
//       level: 9,
//     },

//   });
//   ytpl(url).then(playlist => {
//     playlist.items.forEach(async (videor, index) => {
//       const videoUrl = `https://www.youtube.com/watch?v=${videor.id}`;
//       const info = await ytdl.getInfo(videoUrl)
//       if (!info.videoDetails.isLiveContent) {
//         const video = ytdl(videoUrl, { filter: 'videoonly', quality: 'highestvideo' });
//         const audio = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
//         const ffmpegProcess = cp.spawn(ffmpeg as string, [
//           '-i', `pipe:3`,
//           '-i', `pipe:4`,
//           '-map', '0:v',
//           '-map', '1:a',
//           '-c:v', 'copy',
//           '-c:a', 'libmp3lame',
//           '-crf', '27',
//           '-preset', 'veryfast',
//           '-movflags', 'frag_keyframe+empty_moov',
//           '-f', 'mp4',
//           '-loglevel', 'error',
//           '-'
//         ], {
//           stdio: [
//             'pipe', 'pipe', 'pipe', 'pipe', 'pipe',
//           ],
//         }) as any;


//         video.pipe(ffmpegProcess.stdio[3]);
//         audio.pipe(ffmpegProcess.stdio[4]);

//         ffmpegProcess.stdout.on('error', function (err: { code: string; }) {
//           if (err.code == "EPIPE") {
//             process.exit(0);
//           }
//         });

//         ffmpegProcess.on(
//           'exit',
//           (exitCode: number) => {
//             if (exitCode === 1) {
//             }
//           }
//         )

//         zipFile.append(ffmpegProcess.stdio[1], { name: `${crypto.randomBytes(20).toString('hex')}.mp4` });
//       }

//     })

//   })
//   app.get(urldown, (req, res) => {
//     res.writeHead(200, {
//       'Content-disposition': 'attachment;filename=' + `${filename}.zip`,
//     });



//     zipFile.pipe(res);
//     zipFile.finalize();

//     session.emit('session', filename)
//     hasDownloaded.emit('downloaded');
//   });

//   return `https://${process.env.host}${urldown}`


// }

module.exports = {
  data: {
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
  },
  exe: async (interaction: ChatInputCommandInteraction, app: Express) => {
    const youtube = new Youtube(app);

    const objectName = interaction.options.getString('input') as string;

    const download = await youtube.createDownload(objectName);
    if(download.status != 4) {
      if(download.status == 2) return interaction.reply('Playlist not found');
      else if (download.status == 1) {
        interaction.reply({
          content: '',
          embeds: [
            new EmbedBuilder()
              .setTitle((await ytpl(objectName)).title)
              .setDescription('Click button below to download')
          ],
          components: [
            new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Download')
                .setURL(`https://${process.env.host}${download.urlDownload}`)
            )
          ]
        } as any)
      } else if (download.status == 3) {
        const info = await (await ytdl.getInfo(objectName)).videoDetails
        interaction.reply({
          content: '',
          embeds: [
            new EmbedBuilder()
              .setTitle(info.title)
              .setDescription('Click button below to download')
          ],
          components: [
            new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Download')
                .setURL(`https://${process.env.host}${download.urlDownload}`)
            )
          ]
        } as any)
      }

    } else {
      interaction.reply({
        content: `Please enter the correct youtube url`,
      });
    }
    
  }
}