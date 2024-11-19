import { Dispatch, KeyboardEvent } from "react"

interface Listener<Event, HandlerProps> {
  filter?: (event: Event) => boolean
  handler: Dispatch<HandlerProps>
}

interface DispatcherProps<Event, HandlerProps> {
  getHandlerProps: (event: Event) => HandlerProps
}

class Dispatcher<Event, HandlerProps> {
  private listeners: Listener<Event, HandlerProps>[] = []
  private before: Dispatch<HandlerProps>[] = []
  private after: Dispatch<HandlerProps>[] = []

  constructor(private options: DispatcherProps<Event, HandlerProps>) {}

  public emit(event: Event) {
    const listeners = this.listeners.filter(({ filter = () => true }) =>
      filter(event)
    )
    if (listeners.length === 0) return

    const props = this.options.getHandlerProps(event)
    this.before.forEach(handler => handler(props))
    listeners.forEach(({ handler }) => handler(props))
    this.after.forEach(handler => handler(props))
  }

  public listen(...listeners: Listener<Event, HandlerProps>[]) {
    this.listeners.push(...listeners)
    return this
  }

  public beforeAll(...handlers: Dispatch<HandlerProps>[]) {
    this.before.push(...handlers)
    return this
  }

  public afterAll(...handlers: Dispatch<HandlerProps>[]) {
    this.after.push(...handlers)
    return this
  }
}

interface KeyEventProps<TElement extends HTMLElement> {
  event: KeyboardEvent<TElement>
}

export interface KeyEventListener<
  TElement extends HTMLElement,
  Extension extends object = {}
> {
  key?: string | string[]
  filter?: (event: KeyboardEvent<TElement>) => boolean
  handler: Dispatch<KeyEventProps<TElement> & Extension>
}

interface KeyEventsProps<
  TElement extends HTMLElement,
  TExtension extends object
> {
  getHandlerProps?: (event: KeyboardEvent<TElement>) => TExtension
}

export class KeyEventDispatcher<
  TElement extends HTMLElement,
  TExtension extends object = {}
> extends Dispatcher<
  KeyboardEvent<TElement>,
  KeyEventProps<TElement> & TExtension
> {
  constructor({ getHandlerProps }: KeyEventsProps<TElement, TExtension>) {
    super({
      getHandlerProps: event => ({
        event,
        ...(getHandlerProps?.(event) ?? ({} as TExtension)),
      }),
    })
  }

  private matchKey(keys: string | string[] = [], eventKey: string) {
    const keysArray = [keys].flat().map(key => key.toLowerCase())
    return keysArray.length === 0
      ? true
      : keysArray.map(key => key.toLowerCase()).includes(eventKey.toLowerCase())
  }

  public listen(...listener: KeyEventListener<TElement, TExtension>[]) {
    listener.forEach(({ key, filter = () => true, handler }) =>
      super.listen({
        filter: event => this.matchKey(key, event.key) && filter(event),
        handler,
      })
    )
    return this
  }
}
