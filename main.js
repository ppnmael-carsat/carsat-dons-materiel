// point d'entree de l'appli electron
// ce fichier cree la fenetre et charge index.html dedans

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function creerFenetre() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'src', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    backgroundColor: '#f4f1eb'
  });

  // pas de barre de menu (fichier/edition/affichage...), inutile pour cette appli
  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // decommenter la ligne suivante pour ouvrir les outils de dev pendant les tests
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(creerFenetre);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) creerFenetre();
});
