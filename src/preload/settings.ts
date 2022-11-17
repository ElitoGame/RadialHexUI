import { electronAPI } from '@electron-toolkit/preload';
import { SearchResult } from '@lyrasearch/lyra';
const { contextBridge, ipcRenderer } = require('electron');

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('electronAPI', {
      sendData: (dataToSubmit: any[]) => {
        console.log(JSON.stringify(dataToSubmit) + 'from preload');
        ipcRenderer.send('settings', dataToSubmit);
      },
      search: (
        query: string
      ): Promise<
        | SearchResult<{
            executable: 'string';
            name: 'string';
            icon: 'string';
          }>
        | undefined
      > => ipcRenderer.invoke('settings:search', query),
      addApp: (
        app: string
      ): Promise<{ executable: string; name: string; icon: string } | undefined> => {
        console.log('Preload: addApp: ' + app);
        return ipcRenderer.invoke('settings:addApp', app);
      },
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
