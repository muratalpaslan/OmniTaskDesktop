const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Gerekirse buraya API fonksiyonları eklenebilir
});