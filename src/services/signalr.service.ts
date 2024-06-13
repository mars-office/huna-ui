import {HubConnectionBuilder, HubConnection, HubConnectionState} from '@microsoft/signalr';
import { userStore } from '../stores/user.store';
import { Subject } from '../helpers/behaviour-subject';
import { SignalrMessage } from '../dto/signalr-message';

class SignalrService {
  private hubConnection: HubConnection;
  private dataSubject = new Subject<SignalrMessage<any>>();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds() {
            return 5000;
        },
      })
      .withKeepAliveInterval(15000)
      .withServerTimeout(30000)
      .withUrl('/api/signalr/mainHub', {
        accessTokenFactory: () => {
          return userStore.value?.access_token || "";
        }
      })
      .build();

    this.hubConnection.on('receiveData', p => {
      this.dataSubject.next(p);
    });
  }

  async connect() {
    try {
      await this.hubConnection.start();
      if (this.hubConnection.state !== HubConnectionState.Connected) {
        throw new Error('Not connected');
      }
    } catch (err) {
      setTimeout(() => {
        this.connect();
      }, 5000);
    }
  }

  async disconnect() {
    return await this.hubConnection.stop();
  }

  get connectionState() {
    return this.hubConnection.state;
  }

  listen<T>(eventType: string, cb: (payload: T) => Promise<void>, errorHandler?: ((e: any) => void) | undefined) {
    return this.dataSubject.subscribe({
      onError: err => {
        if (errorHandler) {
          errorHandler(err);
        }
      },
      onNext: sm => {
        if (sm.type.toLowerCase() !== eventType.toLowerCase()) {
          return;
        }
        (async () => {
          await cb(sm.payload as T);
        })();
      }
    });
  }
}

export const signalrService = new SignalrService();
export default signalrService;