import { Middleware, Store } from 'redux';
import { Sink } from './Sink';

export type Constructor<T = any> = new (...args: Array<any>) => T;

export type EffectHandler<TPayload = any> = (payload: TPayload) => any;
export type ReduceHandler<TPayload = any> = (state: any, payload: TPayload) => any;
export type AnyFunction = (...args: Array<any>) => any;

export interface TriggerOptions {
  priority?: number;      // default: 0
  lazyLoad?: boolean;  // default: true
  rawAction?: boolean;    // default: false
  formatter?: AnyFunction;
}

export interface TriggerEvent {
  actionType: string;
  handler: AnyFunction;
  options: TriggerOptions;
}

export interface TriggerEventHandler {
  priority: number;
  handler: AnyFunction;
}

export interface StoreConfiguration<TState = any> {
  reducers?: { [key: string]: any };
  middlewares?: Array<Middleware>;
  preloadedState?: TState;
  devToolOptions?: DevToolOptions;
}

export interface BuildSinkParams {
  getStore: () => Store | undefined;
  getSink: (constructor: Constructor) => Sink;
}

export interface DevToolOptions {
  devToolCompose: AnyFunction;
  disabled?: boolean;
  [key: string]: any;
}

export interface SinkAction {
  type: string;
  payload: any;
  effect?: boolean;
}

export type SinkDispatch = (...args: Array<any>) => SinkAction | undefined;
