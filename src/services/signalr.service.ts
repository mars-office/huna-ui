import {HubConnectionBuilder, HubConnection, HubConnectionState} from '@microsoft/signalr';
import { userStore } from '../stores/user.store';
import { Subject } from '../helpers/behaviour-subject';

class SignalrService {
  private hubConnection: HubConnection;
  private dataSubject = new Subject<any>();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withAutomaticReconnect()
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

  get dataReceived() {
    return this.dataSubject;
  }
}

export const signalrService = new SignalrService();
export default signalrService;