import { io, Socket } from "socket.io-client";
const SOCKET_URL = `http://103.127.30.171:8080`;

type Callback = (...args: any[]) => void;

class WSService {
  private socket: Socket | null = null;

  initialiseWS = async (): Promise<void> => {
    try {
      this.socket = io(SOCKET_URL);

      this.socket.on("connect", () => {
        console.log(
          "Socket event: connect",
          this.socket?.connected,
          this.socket?.id
        );
      });

      this.socket.on("reconnect_attempt", () => {
        console.log("Socket event: reconnect_attempt");
      });

      this.socket.on("reconnect_error", (error: Error) => {
        console.log("Socket event: reconnect_error", error);
      });

      this.socket.on("connect_error", (error: Error) => {
        console.log("Socket event: connect_error", error);
      });

      this.socket.on("error", (error: Error) => {
        console.log("Socket event: error", error);
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("Socket event: disconnect", reason);
      });
    } catch (e) {
      console.log("WS Initialization Failed", e);
    }
  };

  emit<T = any>(event: string, data: object = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.emit(event, data, (res: T) => {
          resolve(res);
        });
      } else {
        reject(new Error("Socket is not initialized."));
      }
    });
  }

  on(event: string, cb: Callback): void {
    if (this.socket) {
      this.socket.on(event, cb);
    } else {
      console.error(
        `Cannot attach event listener to ${event}, socket not initialized.`
      );
    }
  }

  off(event: string): void {
    this.socket?.off(event)
  }

  close(): void {
    // this.socket.
    this?.socket?.close();
  }
}

const SocketServices = new WSService();
export default SocketServices;
