
import {app, BrowserWindow, screen} from 'electron';
import {setupTitlebar, attachTitlebarToWindow} from "custom-electron-titlebar/main";

export class Electron {
    public createWindow: Function;
    public init: Function;

    constructor(callback: any) {
        setupTitlebar();
        callback();

        this.createWindow = (webPreferences: any) => {
            const computerScale = screen.getPrimaryDisplay().size;
            const main = this.window(computerScale.width*0.5, computerScale.height*0.5, {
                ...webPreferences,
            });

            attachTitlebarToWindow(main);
        }

        this.init = (webPreferences: any) => {
            app.whenReady().then(() => {
                this.createWindow(webPreferences);

                app.on('activate', () => {
                    if(BrowserWindow.getAllWindows().length === 0) return this.createWindow(webPreferences)
                })
            })

            app.on('window-all-closed', () => {
                if (process.platform !== 'darwin') app.quit()
            })
        }
    }

    /**
     * 
     * @param width 
     * @param height 
     * @param webPreferences 
     * @param frame 
     * @returns 
     */
    private window(width: number, height: number, webPreferences: any, frame = false) {
        return new BrowserWindow({
            width: width,
            height: height,
            frame: frame,
            titleBarStyle: 'hidden',
            webPreferences: {
                sandbox: false,
                ...webPreferences,
            }
        });

    }
}