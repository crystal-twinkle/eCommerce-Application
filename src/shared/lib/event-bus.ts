export enum EventBusActions {
  LOGIN = 'login',
  REGISTER = 'register',
  UPDATE_USER = 'update-user',
  SORT_CATALOG = 'sort-catalog',
  SEARCH_PRODUCT = 'search-product',
}

class EventBus {
  private readonly subscriptions: {
    [key: string]: Record<string, (...args: unknown[]) => void>;
  };

  constructor() {
    this.subscriptions = {};
  }

  public subscribe(eventType: EventBusActions, callback: (...args: unknown[]) => void): { unsubscribe: () => void } {
    const id = Date.now();

    if (!this.subscriptions[eventType]) {
      this.subscriptions[eventType] = {};
    }

    this.subscriptions[eventType][id] = callback;

    return {
      unsubscribe: () => {
        delete this.subscriptions[eventType][id];
        if (Object.keys(this.subscriptions[eventType]).length === 0) {
          delete this.subscriptions[eventType];
        }
      },
    };
  }

  public publish(eventType: EventBusActions, arg?: unknown): void {
    if (!this.subscriptions[eventType]) {
      return;
    }

    Object.keys(this.subscriptions[eventType]).forEach((key: string) => this.subscriptions[eventType][key](arg));
  }
}

const eventBus = new EventBus();

export default eventBus;
