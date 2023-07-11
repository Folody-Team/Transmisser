export type download = () => any;

export type hasDownloadName = {
	downloaded: download;
};

export const hasDownloadArray: Array<keyof hasDownloadName> =  ['downloaded'];
export type eventsType = hasDownloadName;

