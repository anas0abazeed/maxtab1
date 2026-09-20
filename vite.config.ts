import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function suppressHmrWsPlugin(): Plugin {
  return {
    name: 'suppress-hmr-ws',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        return [
          {
            tag: 'script',
            injectTo: 'head-prepend',
            children: `
(function() {
  if (typeof window !== 'undefined') {
    if (window.WebSocket) {
      var OrigWebSocket = window.WebSocket;
      window.WebSocket = function(url, protocols) {
        var isViteHmr = (Array.isArray(protocols) && protocols.indexOf('vite-hmr') !== -1) || protocols === 'vite-hmr' || (typeof url === 'string' && url.indexOf('vite-hmr') !== -1);
        if (isViteHmr) {
          var listeners = {};
          return {
            OPEN: 1, CLOSED: 3, CLOSING: 2, CONNECTING: 0,
            readyState: 1,
            protocol: 'vite-hmr',
            url: String(url),
            addEventListener: function(event, fn) {
              listeners[event] = listeners[event] || [];
              listeners[event].push(fn);
              if (event === 'open') {
                setTimeout(function() { try { fn({ type: 'open' }); } catch(e){} }, 0);
              }
            },
            removeEventListener: function(event, fn) {
              if (listeners[event]) {
                listeners[event] = listeners[event].filter(function(cb) { return cb !== fn; });
              }
            },
            send: function() {},
            close: function() {
              this.readyState = 3;
              if (listeners['close']) {
                listeners['close'].forEach(function(cb) { try { cb({ type: 'close' }); } catch(e){} });
              }
            },
            dispatchEvent: function() { return true; }
          };
        }
        return new OrigWebSocket(url, protocols);
      };
      window.WebSocket.prototype = OrigWebSocket.prototype;
      window.WebSocket.OPEN = 1;
      window.WebSocket.CLOSED = 3;
      window.WebSocket.CLOSING = 2;
      window.WebSocket.CONNECTING = 0;
    }

    var origConsoleError = console.error;
    console.error = function() {
      var args = Array.prototype.slice.call(arguments);
      var msg = args.join(' ');
      if (msg.indexOf('[vite] failed to connect to websocket') !== -1 || msg.indexOf('WebSocket closed without opened') !== -1) {
        return;
      }
      return origConsoleError.apply(console, args);
    };

    window.addEventListener('unhandledrejection', function(e) {
      var reason = e && e.reason ? (e.reason.message || String(e.reason)) : '';
      if (reason.indexOf('WebSocket') !== -1 || reason.indexOf('vite') !== -1) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    window.addEventListener('error', function(e) {
      var msg = e && e.message ? e.message : '';
      if (msg.indexOf('WebSocket') !== -1 || msg.indexOf('vite') !== -1) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }
})();
            `.trim(),
          },
        ];
      },
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [suppressHmrWsPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: false,
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
