import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';

const __dirname = process.cwd();

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
const createMainWindow = () => {

    const mainWindow = new BrowserWindow({
        title: 'Image Resizer', 
        width: isDev ? 1000 : 500, 
        height: 600, 
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'), 
            contextIsolation: true,
            nodeIntegration: true, 
        }
    });

    if (isDev) {
        mainWindow.webContents.openDevTools(); 
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

function createAboutWindow () {
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer', 
        width: 300, 
        height: 300
    });

    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}


app.whenReady().then(() => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

   app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
}).catch((err) => console.log(err));

const menu = [
    ...(isMac ? [{
        label: app.name, 
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            }
        ]
    }] : []),
    {
        role: 'fileMenu'
    },
    ...(!isMac ? [{
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            }
        ]
    }] : []),
  
]


app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    };
});
