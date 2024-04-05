# Use-State-Values

A react hook which provides simple abstraction over state to push state updates to  leaf components

create state at any parent component and render it only in the components that need it

## Installation

```sh
npm install @monynethala/use-state-values

```


## Api

```js
class StateValue<V = any> {
    private current;
    private prev;
    private readonly subscribers;
    constructor(initialValue?: V);
    get(): V | undefined;
    set(current: V | ((prevValue: V) => V)): V;
    subscribe(updater: Updater<V>, call?: boolean): () => void;
    unsubscribe(updater: Updater<V>): void;
    getPrevious(): V | undefined;
    private notifySubscribers;
}

type StateValues<T extends object> = {
    [K in keyof T]: T extends StateValue<infer U> ? T : StateValue<T>;
};

type Valid<T> = {
     [P in keyof T]: T[P] extends Primitive | StateValue<any> ? T[P] : never;
 };

function useStateValues<T extends Valid<T>>(initialValue: T): [StateValueState<T>, StateValues<T>];

```

# Basic Usage

```jsx

import useStateValues from '@monynethala/use-state-values'


const Nested = ({ prop }: { prop: StateValue<number> }) => {
  
  const [renderState, stateValues] = useStateValues({ x: prop });
  const { x } = renderState;
  return (
      <div>{x}</div>
  );
};

export default function App() {
  const [renderState, stateValues] = useStateValues({ x: 0, y: "mony" });

  // Destructure renderState to convert StateValue to state
  const { x } = renderState;

  const intervalRef = useRef<number | undefined>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      values.y.setCurrent((x) => x + 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

 // Component rerenders only when the 'x' changes

  return (
    <div className="App">
      <div>{x}</div>
      <Nested prop={values.y} />
    </div>
  );
}


```

