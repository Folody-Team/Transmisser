import { Youtube as YoutubeCore } from './YoutubeCore'
import { Express } from 'express'
import { Result } from 'ytpl';
import crypto from 'node:crypto';
import archiver, { Archiver } from 'archiver';

export class Youtube extends YoutubeCore {
  private YOUTUBE = /(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<> #]+)/;
  private r!: number;
  private l!: number;

  constructor(app: Express) {
    super(app);
  }

  /**
   * 
   * @param url 
   */
  public async createDownload(url: string) {
    var info;

    const videoUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
    const solvePlaylist = async (id: number, playlist: Result, zip: Archiver) => {
      const url = videoUrl(playlist.items[id].id)
      info = await this.ytdl.getInfo(url)
      if (!info.videoDetails.isLiveContent) {
        const video = this.getVideo(url).video;
        const audio = this.getAudio(url).audio;

        const ffmpegProcess = this.ffmpeg.run() as any

        video.pipe(ffmpegProcess.stdio[3])
        audio.pipe(ffmpegProcess.stdio[4])

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

        zip.append(ffmpegProcess.stdio[1], { name: `${crypto.randomBytes(20).toString('hex')}.mp4` });
      }
    }

    if (url.match(this.YOUTUBE)) {
      if (url.includes('list')) {
        const playlist = await this.ytpl(url).catch(err => { });
        if (!playlist || typeof playlist == 'undefined') return {
          code: 1001,
          zipFile: null,
          video: null
        }
        const zipFile = archiver('zip', { zlib: { level: 9 } });

        this.l = 0;
        this.r = playlist.items.length;

        while (this.l <= this.r) {

          if (this.l === this.r) {
            solvePlaylist(this.l, playlist, zipFile)
          } else {
            solvePlaylist(this.l, playlist, zipFile)
            solvePlaylist(this.r, playlist, zipFile)

          }

          ++this.l;
          --this.r;
        }

        return {
          code: 1002,
          zipFile: zipFile,
          video: null
        }

      } else {
        return {
          code: 1002,
          zipFile: null,
          video: null
        }

      }
    } else {
      return {
        code: 1001,
        zipFile: null,
        video: null
      }
    }


    // create filename with randomByte
    const filename = crypto.randomBytes(20).toString('hex')




  }

  /**
   * 
   * @param url 
   */
  private getVideo(url: string) {
    return Object.assign(this, {
      video: this.ytdl(url, {
        filter: 'videoonly',
        quality: 'highestvideo'
      })
    })
  }

  /**
  * 
  * @param url 
  */
  private getAudio(url: string) {
    return Object.assign(this, {
      audio: this.ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio'
      })
    })
  }
}