
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
            const main = this.window(computerScale.width/1.7, computerScale.height/1.5, {
                ...webPreferences,
            });
            
            Menu.setApplicationMenu(null);

            main.webContents.on('did-finish-load', ()=>{
                let code = `const card = document.getElementById('input')
                if (card) {
                  card.onmousemove = e => {
                    const rect = card.getBoundingClientRect(),
                      x = e.clientX - rect.left,
                      y = e.clientY - rect.top;
              
                    card.style.setProperty("--mouse-x", \`\${x}px\`);
                    card.style.setProperty("--mouse-y", \`\${y}px\`);
                  }
                }`;
                main.webContents.executeJavaScript(code);
            });
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
            resizable: false,
            maximizable: false,
            webPreferences: {
                sandbox: false,
                ...webPreferences,
            }
        });

    }
}