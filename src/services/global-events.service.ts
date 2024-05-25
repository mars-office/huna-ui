import { BehaviourSubject, SubscriberEvent, Subscription } from "../helpers/behaviour-subject";

export class GlobalEventsService {
  private _subjects = new Map<string, BehaviourSubject<any | undefined>>();

  publish<T>(eventType: string, data: T) {
    let foundSubject = this._subjects.get(eventType);
    if (!foundSubject) {
      foundSubject = new BehaviourSubject<T | undefined>(data);
      this._subjects.set(eventType, foundSubject);
    }
    foundSubject!.next(data);
  }

  subscribe<T>(eventType: string, subscription: SubscriberEvent<T>) {
    let foundSubject = this._subjects.get(eventType);
    if (!foundSubject) {
      foundSubject = new BehaviourSubject<T | undefined>(undefined);
      this._subjects.set(eventType, foundSubject);
    }
    return foundSubject!.subscribe(subscription) as Subscription<T>;
  }
  
  clear(eventType: string) {
    let foundSubject = this._subjects.get(eventType);
    if (!foundSubject) {
      return;
    }
    foundSubject.next(undefined);
  }
}
export const globalEventsService = new GlobalEventsService();
export default globalEventsService;