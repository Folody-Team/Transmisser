import ffmpegCore from 'ffmpeg-static';
import cp from 'child_process';

export class FFMPEG {
  private ffmpeg = ffmpegCore;
  private data = {}
  private stdio = ['pipe', 'pipe', 'pipe', 'pipe', 'pipe',]

  constructor() {
    Object.assign(this.data, {'-c:v': `copy`});
    Object.assign(this.data, {'-c:a': `libmp3lame`});
    Object.assign(this.data, {'-crf': `27`});
    Object.assign(this.data, {'-preset': `veryfast`});
    Object.assign(this.data, {'-movflags': `frag_keyframe+empty_moov`});
    Object.assign(this.data, {'-f': `mp4`});
    Object.assign(this.data, {'-loglevel': `error`});
  }

  public run() {
    const data: string[] = []

    // Fun joke O(1) algorithm
    data.push('-i', `pipe:3`);
    data.push('-i', `pipe:4`);
    data.push('-map', `0:v`);
    data.push('-map', `1:a`);
    Object.entries(this.data).map(([key, value]) => {
      return data.push(key, value as string);
    })
   
    return cp.spawn(this.ffmpeg as string, data, {stdio: this.stdio as cp.StdioPipe[]});


  }
}