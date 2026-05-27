package gowebi

import (
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const browserReloadScript = `
<script>
let disconnected = false;
function connect() {
  const ws = new WebSocket("ws://localhost:35729/ws");
  ws.onopen = () => {
    console.log("dev websocket connected");
    if (disconnected) {
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
    disconnected = false;
  };
  ws.onmessage = (e) => {
    if (e.data === "reload") {
      window.location.reload();
    }
  };
  ws.onclose = () => {
    console.log("dev websocket disconnected");
    disconnected = true;
    setTimeout(connect, 300);
  };
  ws.onerror = () => {
    ws.close();
  };
}
connect();
</script>`

type wsHandler struct {
	watchPath string
	upg       *websocket.Upgrader
	conns     map[*websocket.Conn]bool
	mu        sync.RWMutex
}

func newWSHandler(watchPath string) *wsHandler {
	return &wsHandler{
		watchPath: watchPath,
		conns:     make(map[*websocket.Conn]bool),
		upg: &websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}
}

func (ws *wsHandler) start() error {
	go ws.loop()

	http.HandleFunc("/ws", ws.handleWS)
	return http.ListenAndServe(":35729", nil)
}

func (ws *wsHandler) handleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := ws.upg.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	ws.mu.Lock()
	ws.conns[conn] = true
	ws.mu.Unlock()
}

func (ws *wsHandler) loop() {
	ticker := time.NewTicker(time.Millisecond * 500)
	defer ticker.Stop()

	var lastMod time.Time
	for range ticker.C {
		info, err := os.Stat(ws.watchPath)
		if err != nil {
			continue
		}

		mod := info.ModTime()
		if mod.After(lastMod) {
			ws.broadcast()
			lastMod = mod
		}
	}
}

func (ws *wsHandler) broadcast() {
	ws.mu.Lock()
	defer ws.mu.Unlock()

	for conn := range ws.conns {
		if err := conn.WriteMessage(websocket.TextMessage, []byte("reload")); err != nil {
			delete(ws.conns, conn)
			conn.Close()
		}
	}
}
