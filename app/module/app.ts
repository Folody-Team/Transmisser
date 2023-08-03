
import {app, BrowserWindow, screen, Menu, ipcMain} from 'electron';

export class Electron {
    public createWindow: Function;
    public init: Function;

    /**
     * 
     * @param callback 
     */
    constructor(callback: any) {
        callback();

        /**
         * @param webPreferences
         */
        this.createWindow = (webPreferences: any) => {
            const computerScale = screen.getPrimaryDisplay().size;
            const main = this.window(computerScale.width/1.5, computerScale.height/1.5, {
                ...webPreferences,
            });
            
            Menu.setApplicationMenu(null);

            main.webContents.openDevTools()
            main.loadURL('http://localhost:3000/');
            this.setTitleBar(main);
        }

        /**
         * @param webPreferences
         */
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
     * @param browser 
     */
    private setTitleBar(browser: BrowserWindow) {
        ipcMain.on('minimize', (event) => {
            browser.minimize();
        });
    
        ipcMain.on('max', (event) => {
            if (browser.isMaximized()) {
                browser.restore();
            } else {
                browser.maximize();
            }
        });
    
        ipcMain.on('close', (event) => {
            browser.close();
        });
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