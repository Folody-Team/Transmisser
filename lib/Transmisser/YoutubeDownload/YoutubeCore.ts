import {Express} from 'express'
import {FFMPEG} from './ffmpeg';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import {EventEmitter} from 'events';
import {eventsType} from './constants/events';

export declare interface Youtube extends EventEmitter {
  on<U extends keyof eventsType>(event: U, listener: eventsType[U]): this;

	emit<U extends keyof eventsType>(
		event: U,
		...args: Parameters<eventsType[U]>
	): boolean;
} 


export class Youtube extends EventEmitter {
  public app!: Express;
  public ffmpeg!: FFMPEG;
  public ytdl!: typeof ytdl;
  public ytpl!: typeof ytpl;

  /**
   * 
   * @param app 
   */
  constructor(app: Express) {
    super();
    Object.assign(this, { app: app });
    Object.assign(this, { ffmpeg: new FFMPEG() });
    Object.assign(this, { ytdl: ytdl });
    Object.assign(this, { ytpl: ytpl });
  }

}