interface Updater<V> {
  (value: V): void;
}

export default class StateValue<V = any> {
  private current: V | undefined;
  private prev: V | undefined;
  private readonly subscribers: Set<Updater<V>>;

  constructor(initialValue?: V) {
    this.current = initialValue;
    this.prev = initialValue;
    this.subscribers = new Set<Updater<V>>();
  }

  public get() {
    return this.current;
  }

  public set(current: V | ((prevValue: V) => V)): V {
    this.prev = this.current;

    if (typeof current === "function") {
      this.current = (current as (prev: V | undefined) => V)(this.current);
    } else {
      this.current = current;
    }

    this.notifySubscribers();
    return this.current;
  }

  public subscribe(updater: Updater<V>, call = true): () => void {
    this.subscribers.add(updater);
    if (call) {
      updater(this.current!);
    }
    return () => {
      this.unsubscribe(updater);
    };
  }

  public unsubscribe(updater: Updater<V>): void {
    this.subscribers.delete(updater);
  }

  public getPrevious() {
    return this.prev;
  }
  private notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => {
      subscriber(this.current!);
    });
  }
}

export type StateValueType = StateValue;
