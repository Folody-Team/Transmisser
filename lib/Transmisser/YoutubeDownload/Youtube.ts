import { Youtube as YoutubeCore } from './YoutubeCore'
import { Express } from 'express'
import { Result } from 'ytpl';
import crypto from 'node:crypto';
import archiver, { Archiver } from 'archiver';
import { Response } from './constants/response'
export class Youtube extends YoutubeCore {
  private YOUTUBE = /(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<> #]+)/;
  private WATERMARK = Buffer.from('5472616e736d6973736572', 'hex').toString('utf-8');

  constructor(app: Express) {
    super(app);
  }

  /**
   * 
   * @param url 
   */
  public async createDownload(url: string): Promise<Response> {
    var info;

    const videoUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
    const solvePlaylist = async (id: number, playlist: Result, zip: Archiver) => {
      console.log(playlist.items[id].title)
      const url = videoUrl(playlist.items[id].id)
      info = await this.ytdl.getInfo(url)
      if (!info.videoDetails.isLiveContent) {
        const video = this.getVideo(url).video;
        const audio = this.getAudio(url).audio;

        const ffmpegProcess = this.ffmpegProcess();

        video.pipe(ffmpegProcess.stdio[3])
        audio.pipe(ffmpegProcess.stdio[4])


        zip.append(ffmpegProcess.stdio[1], { name: `${crypto.randomBytes(20).toString('hex')}.mp4` });
      }
    }

    const loop = (c: Result, z: Archiver, l: number, r: number): void => {
      while (l <= r) {
        if (l === r) {
          solvePlaylist(l, c, z)
        } else {
          solvePlaylist(l, c, z)
          solvePlaylist(r, c, z)

        }

        ++l;
        --r;
      }
    } 

    const mid = (c: Result, z: Archiver, l: number, r: number): void =>  {
      if((l+r)/2 > 3) {
        mid(c, z, l, (c.items.length-1)/2);
        mid(c, z, (c.items.length-1)/2+1, r);
      } else {
        return loop(c, z, l, r);
      }
    }
    if (url.match(this.YOUTUBE)) {
      const urlDownload = `/download/${crypto.randomBytes(20).toString('hex')}`;

      if (url.includes('list')) {
        const playlist = await this.ytpl(url).catch(err => { });
        if (!playlist || typeof playlist == 'undefined') return {
          status: 2,
          urlDownload: ''
        }
        const zipFile = archiver('zip', { zlib: { level: 9 } });

        var l = 0;
        var r = playlist.items.length - 1;
        
        mid(playlist, zipFile, l, r)

        this.app.get(urlDownload, (req, res) => {
          const header = Object.assign({}, {
            'Content-disposition': 'attachment;filename=' + `${this.WATERMARK}_${playlist.title.replace(' ', '_')}.zip`
          })

          res.writeHead(200, header);

          zipFile.pipe(res);
          zipFile.finalize();

          this.emit('downloaded');
        })

        this.on('downloaded', () => {

          var routes = this.app._router.stack;
          routes.forEach(removeMiddlewares);
          function removeMiddlewares(route: { route: { path: string; }; }, i: any, routes: any[]) {
            if (route.route) {
              if (route.route.path) {
                if (route.route.path == urlDownload) {
                  routes.splice(i, 1)
                }
              }
            }

          }

          // hasDownloaded = null;


        })
        return {
          urlDownload: urlDownload,
          status: 1
        }

      } else {
        const video = this.getVideo(url).video;
        const audio = this.getAudio(url).audio;

        const ffmpegProcess = this.ffmpegProcess();

        video.pipe(ffmpegProcess.stdio[3])
        audio.pipe(ffmpegProcess.stdio[4])




        this.app.get(urlDownload, (req, res) => {
          res.writeHead(200, {
            'Content-disposition': 'attachment;filename=' + `${this.WATERMARK}_${crypto.randomBytes(20).toString('hex')}.mp4`
          });

          ffmpegProcess.stdio[1].pipe(res.status(200))

          this.emit('downloaded')

        })

        this.on('downloaded', () => {

          var routes = this.app._router.stack;
          routes.forEach(removeMiddlewares);
          function removeMiddlewares(route: { route: { path: string; }; }, i: any, routes: any[]) {
            if (route.route) {
              if (route.route.path) {
                if (route.route.path == urlDownload) {
                  routes.splice(i, 1)
                }
              }
            }

          }

          // hasDownloaded = null;


        })
        return {
          urlDownload: urlDownload,
          status: 3
        }

      }
    } else {
      return {
        urlDownload: '',
        status: 4
      };
    }
  }

  /**
   * 
   * @returns 
   */
  private ffmpegProcess() {
    const ffmpegProcess = this.ffmpeg.run() as any;

    ffmpegProcess.stdout.on('error', function (err: { code: string; }) {
      if (err.code == "EPIPE") {
        process.exit(0);
      }
    });

    ffmpegProcess.on(
      'exit',
      (exitCode: number) => {
        if (exitCode === 1) {
        }
      }
    )

    return ffmpegProcess;
  }


}