enum BehaviourSubjectState {
  NOT_FIRED,
  LIVE,
  COMPLETE
}

export class Subscription<T> {
  private _subscribers: Map<Subscription<T>, SubscriberEvent<T>>;

  constructor(subscribers: Map<Subscription<T>, SubscriberEvent<T>>) {
    this._subscribers = subscribers;
  }

  unsubscribe() {
    this._subscribers.delete(this);
  }
}

export type SubscriberEvent<T> = {onNext?: (v: T, subscription?: Subscription<T>) => void, onError?: (v: Error, s?: Subscription<T>) => void, onComplete?: (s?: Subscription<T>) => void};

export class BehaviourSubject<T> {
  private _value: T;
  private _state = BehaviourSubjectState.NOT_FIRED;
  private _subscribers = new Map<Subscription<T>, SubscriberEvent<T>>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  next(newValue: T) {
    if (this._state === BehaviourSubjectState.COMPLETE) {
      throw new Error('BehaviourSubject is complete.');
    }
    this._state = BehaviourSubjectState.LIVE;
    this._value = newValue;
    this._subscribers.forEach((se, s) => {
      if (se.onNext) {
        se.onNext(this._value, s);
      }
    });
  }

  complete() {
    this._state = BehaviourSubjectState.COMPLETE;
    this._subscribers.forEach((se, s) => {
      if (se.onComplete) {
        se.onComplete(s);
      }
    });
  }

  error(err: Error) {
    this._subscribers.forEach((se, s) => {
      if (se.onError) {
        se.onError(err, s);
      }
    });
  }

  subscribe(se: SubscriberEvent<T>) {
    const newSubscription = new Subscription(this._subscribers);
    this._subscribers.set(newSubscription, se);
    if (se.onNext) {
      se.onNext(this._value, newSubscription);
    }
    return newSubscription;
  }

  get value() {
    return this._value;
  }
}

export class Subject<T> {
  private _state = BehaviourSubjectState.NOT_FIRED;
  private _subscribers = new Map<Subscription<T>, SubscriberEvent<T>>();

  constructor() {
  }

  next(newValue: T) {
    if (this._state === BehaviourSubjectState.COMPLETE) {
      throw new Error('BehaviourSubject is complete.');
    }
    this._state = BehaviourSubjectState.LIVE;
    this._subscribers.forEach(se => {
      if (se.onNext) {
        se.onNext(newValue);
      }
    });
  }

  complete() {
    this._state = BehaviourSubjectState.COMPLETE;
    this._subscribers.forEach(se => {
      if (se.onComplete) {
        se.onComplete();
      }
    });
  }

  error(err: Error) {
    this._subscribers.forEach(se => {
      if (se.onError) {
        se.onError(err);
      }
    });
  }

  subscribe(se: SubscriberEvent<T>) {
    const newSubscription = new Subscription(this._subscribers);
    this._subscribers.set(newSubscription, se);
    return newSubscription;
  }
}