import 'dotenv/config';
import './commands.js';
import crypto from 'crypto';
import express from 'express';
import cp from 'child_process';
import { Client, IntentsBitField } from 'discord.js';
import { EventEmitter } from 'events';
import archiver from 'archiver';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, DiscordRequest } from './utils.js';
import ffmpeg from 'ffmpeg-static';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
  ]
})

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function(req, res) {

  const { type, id, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  } else {
    client.actions.InteractionCreate.handle(req.body)
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    // if (name === 'download_youtube') {
    //   const objectName = req.body.data.options[0].value;



    // }
  }
});

function createDownload(url, session) {
  var hasDownloaded = new EventEmitter()
  const video = ytdl(url, { filter: 'videoonly', quality: 'highestvideo' });
  const audio = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
  const filename = crypto.randomBytes(20).toString('hex')
  const urldown = `/download/${filename}`

  const ffmpegProcess = cp.spawn(ffmpeg, [
    '-i', `pipe:3`,
    '-i', `pipe:4`,
    '-map', '0:v',
    '-map', '1:a',
    '-c:v', 'copy',
    '-c:a', 'libmp3lame',
    '-crf', '27',
    '-preset', 'veryfast',
    '-movflags', 'frag_keyframe+empty_moov',
    '-f', 'mp4',
    '-loglevel', 'error',
    '-'
  ], {
    stdio: [
      'pipe', 'pipe', 'pipe', 'pipe', 'pipe',
    ],
  });

  video.pipe(ffmpegProcess.stdio[3]);
  audio.pipe(ffmpegProcess.stdio[4]);

  let ffmpegLogs = ''

  ffmpegProcess.stdio[2].on(
    'data',
    (chunk) => {
      ffmpegLogs += chunk.toString()
    }
  )

  ffmpegProcess.on(
    'exit',
    (exitCode) => {
      if (exitCode === 1) {
        console.error(ffmpegLogs)
      }
    }
  )

  app.get(urldown, (req, res) => {

    res.writeHead(200, {
      'Content-disposition': 'attachment;filename=' + `${filename}.mp4`,
    });



    ffmpegProcess.stdio[1].pipe(res.status(200))

    session.emit('session', filename)
    hasDownloaded.emit('downloaded');

  })

  hasDownloaded.on('downloaded', () => {

    var routes = app._router.stack;
    routes.forEach(removeMiddlewares);
    function removeMiddlewares(route, i, routes) {
      if (route.route) {
        if (route.route.path) {
          if (route.route.path == urldown) {
            routes.splice(i, 1)
          }
        }
      }

    }

    // hasDownloaded = null;


  })

  return `https://transmisser.folodystudio.repl.co${urldown}`

}

function createDownloadPlaylist(url, session) {
  var hasDownloaded = new EventEmitter()
  const filename = crypto.randomBytes(20).toString('hex')
  const urldown = `/download/${filename}`;
  const zipFile = archiver('zip', {
    zlib: {
      level: 9,
    },

  });
  ytpl(url).then(playlist => {
    playlist.items.forEach(async (videor, index) => {
      const videoUrl = `https://www.youtube.com/watch?v=${videor.id}`;
      const info = await ytdl.getInfo(videoUrl)
      if (!info.videoDetails.isLiveContent) {
        const video = ytdl(videoUrl, { filter: 'videoonly', quality: 'highestvideo' });
        const audio = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
        const ffmpegProcess = cp.spawn(ffmpeg, [
          '-i', `pipe:3`,
          '-i', `pipe:4`,
          '-map', '0:v',
          '-map', '1:a',
          '-c:v', 'copy',
          '-c:a', 'libmp3lame',
          '-crf', '27',
          '-preset', 'veryfast',
          '-movflags', 'frag_keyframe+empty_moov',
          '-f', 'mp4',
          '-loglevel', 'error',
          '-'
        ], {
          stdio: [
            'pipe', 'pipe', 'pipe', 'pipe', 'pipe',
          ],
        });


        video.pipe(ffmpegProcess.stdio[3]);
        audio.pipe(ffmpegProcess.stdio[4]);

        ffmpegProcess.stdout.on('error', function(err) {
          if (err.code == "EPIPE") {
            process.exit(0);
          }
        });

        ffmpegProcess.on(
          'exit',
          (exitCode) => {
            if (exitCode === 1) {
              console.error(ffmpegLogs)
            }
          }
        )

        zipFile.append(ffmpegProcess.stdio[1], { name: `${crypto.randomBytes(20).toString('hex')}.mp4` });
      }

    })

  })
  app.get(urldown, (req, res) => {
    res.writeHead(200, {
      'Content-disposition': 'attachment;filename=' + `${filename}.zip`,
    });



    zipFile.pipe(res);
    zipFile.finalize();

    session.emit('session', filename)
    hasDownloaded.emit('downloaded');
  });

  return `https://transmisser.folodystudio.repl.co${urldown}`


}
// app.use((req, res) => {
//   console.log(req.path)
// })

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName == 'download_youtube') {
      const objectName = interaction.options.getString('input');
      if (String(objectName).match(/(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<> #]+)/)) {
        const session = new EventEmitter()
        if (String(objectName).includes('list')) {
          const check = await ytpl(url).catch(err => { })
          if (!checl || typeof check == 'undefined') return interaction.reply('Playlist not found')
          const url = createDownloadPlaylist(objectName, session);
          const id = url.replace('https://', '').split('/');
          interaction.reply({
            content: '',
            embeds: [{
              title: (await ytpl(objectName)).title,
              description: 'Click button below to download\n **Sesion:** ' + `\`${id[id.length - 1]}\``
            }],
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.BUTTON,
                    label: 'Download',
                    url: url,
                    style: ButtonStyleTypes.LINK,
                  },
                ],
              },
            ]
          }).then(async m => {
            session.on('session', (sessionId) => {
              if (sessionId == id[id.length - 1]) {
                m.edit({
                  content: `**Url closed with session** \`${sessionId}\``,
                  embeds: [],
                  components: []
                })
              }
            })
          });


        } else {
          const info = await ytdl.getInfo(objectName).catch(err => { })
          if (!info || typeof info == 'undefined') return interaction.reply('Video not found')
          if (info.videoDetails.isLiveContent) return interaction.reply("I can't process the live stream video")
          const url = createDownload(objectName, session);
          const id = url.replace('https://', '').split('/');
          interaction.reply({
            content: '',
            embeds: [{
              title: (await info).videoDetails.title,
              description: 'Click button below to download\n **Sesion:** ' + `\`${id[id.length - 1]}\``
            }],
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.BUTTON,
                    label: 'Download',
                    url: url,
                    style: ButtonStyleTypes.LINK,
                  },
                ],
              },
            ]
          }).then(async m => {
            session.on('session', (sessionId) => {
              if (sessionId == id[id.length - 1]) {
                m.edit({
                  content: `**Url closed with session** \`${sessionId}\``,
                  embeds: [],
                  components: []
                })
              }
            })
          });
        }


      } else {
        interaction.reply({
          content: `Please enter the correct youtube url`,
        });
      }
    }
  }
})