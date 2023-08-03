import { init } from './transmisser-runtime'
import { ipcRenderer } from 'electron';
const icon = {
  windows: {
    minimize: '<svg xmlns="http://www.w3.org/2000/svg" style="fill: #A3A3A3; width: 14px" viewBox="0 0 11 11"><path d="M11,4.9v1.1H0V4.399h11z"/></svg>',
    maximize: '<svg xmlns="http://www.w3.org/2000/svg" style="fill: #A3A3A3; width: 14px" viewBox="0 0 11 11"><path d="M0,1.7v7.6C0,10.2,0.8,11,1.7,11h7.6c0.9,0,1.7-0.8,1.7-1.7V1.7C11,0.8,10.2,0,9.3,0H1.7C0.8,0,0,0.8,0,1.7z M8.8,9.9H2.2c-0.6,0-1.1-0.5-1.1-1.1V2.2c0-0.6,0.5-1.1,1.1-1.1h6.7c0.6,0,1.1,0.5,1.1,1.1v6.7C9.9,9.4,9.4,9.9,8.8,9.9z"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" style="fill: #A3A3A3; width: 14px"  viewBox="0 0 11 11"><path d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z"/></svg>'
  }
}



window.addEventListener('DOMContentLoaded', () => {
  init('titlebar', [
    {
      tag: 'div',
      atr: [
        {
          name: 'textContent',
          value: document.title
        },
        {
          name: 'style',
          value: 'padding: 10px; color: #DCDCDC; font-weight: 600;'
        }
      ],
      child: []
    },
    {
      tag: 'div',
      atr: [
        {
          name: 'style',
          value: 'display: flex; align-items: center; -webkit-app-region: no-drag;'
        }
      ],
      child: [
        {
          tag: 'button',
          atr: [
            {
              name: 'innerHTML',
              value: icon.windows.minimize
            },
            {
              name: 'class',
              value: 'titleBtn'
            },
            {
              name: 'style',
              value: 'border: none; display: flex; align-items: center; justify-content: center; padding: 14px 12px;'
            },
            {
              name: 'onClick',
              value: () => {
                ipcRenderer.send('minimize');
              }
            }
          ],
          child: []
        },
        {
          tag: 'button',
          atr: [
            {
              name: 'innerHTML',
              value: icon.windows.close
            },
            {
              name: 'class',
              value: 'titleBtn'
            },
            {
              name: 'style',
              value: 'border: none;  display: flex; align-items: center; justify-content: center;  padding: 14px 12px;'
            },
            {
              name: 'onClick',
              value: () => {
                
                ipcRenderer.send('close');
              }
            }
          ],
          child: []
        },
        {
          tag: 'button',
          atr: [
            {
              name: 'innerHTML',
              value: icon.windows.maximize
            },
            {
              name: 'class',
              value: 'titleBtn'
            },
            {
              name: 'style',
              value: 'border: none; display: flex; align-items: center; justify-content: center;  padding: 14px 12px;'
            },
            {
              name: 'onClick',
              value: () => {
                ipcRenderer.send('max');
              }
            }
          ],
          child: []
        }
      ]
    }
  ])
});