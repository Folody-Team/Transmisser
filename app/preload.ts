import { init } from './transmisser-runtime'
import { ipcRenderer } from 'electron';
const icon = {
  windows: {
    minimize: '<svg xmlns="http://www.w3.org/2000/svg" style="fill: #A3A3A3; width: 14px" viewBox="0 0 11 11"><path d="M11,4.9v1.1H0V4.399h11z"/></svg>',
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
          value: ''
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
        }
      ]
    }
  ])
});