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
        console.log(JSON.stringify(dataToSubmit) + 'fromm preload');
        ipcRenderer.send('settings', dataToSubmit);
      },
      setIgnoreMouseEvents: (yes: boolean, forward: { forward: boolean } = { forward: false }) => {
        ipcRenderer.send('set-ignore-mouse-events', yes, forward);
      },
      toggleWindow: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('toggle-window', callback);
      },
      getMousePosition: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('set-mouse-position', callback);
      },
      openApp: (app: string, url: string) => {
        ipcRenderer.invoke('hexUI:openApp', app, url);
      },
      runAction: (action: string, option?: string) => {
        ipcRenderer.invoke('hexUI:runAction', action, option);
      },
      getHexUiData: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('hexUI:getHexUiData', callback);
      },
      getSettingsData: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('hexUI:getSettingsData', callback);
        console.log(callback.arguments);
      },
      search: (
        query: string,
        offset: number
      ): Promise<
        | SearchResult<{
            executable: 'string';
            name: 'string';
            icon: 'string';
            type: 'string';
          }>
        | undefined
      > => ipcRenderer.invoke('settings:search', query, offset),
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
