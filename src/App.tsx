import { useEffect, useRef, ReactNode } from "react";
import { StateValue, useStateValues } from "../lib/main";
import FlashComponent from "./flashWrapper";
import "./App.css";

function Fushcia({
  fuschia,
  children,
}: {
  fuschia: StateValue<number>;
  children?: ReactNode;
}) {
  const [renderState, stateValues] = useStateValues({ fuschia });
  const { fuschia: state } = renderState;
  const { fuschia: fuschiaValue } = stateValues;

  return (
    <FlashComponent>
      <div
        onMouseMove={(e) => {
          e.stopPropagation();
          fuschiaValue.set((x) => x + 1);
        }}
        className="fuschia box"
      >
        <div>{state}</div>
        {children ? children : null}
      </div>
    </FlashComponent>
  );
}

function Pink({
  pink,
  children,
}: {
  pink: StateValue<number>;
  children?: ReactNode;
}) {
  const [renderState, stateValues] = useStateValues({ pink });
  const { pink: state } = renderState;
  const { pink: pinkValue } = stateValues;

  return (
    <FlashComponent>
      <div
        onMouseMove={(e) => {
          e.stopPropagation();
          pinkValue.set((x) => x + 1);
        }}
        className="box pink"
      >
        <div>{state}</div>
        {children ? children : null}
      </div>
    </FlashComponent>
  );
}
function App() {
  const [renderState, stateValues] = useStateValues({ fuschia: 0, pink: 0 });

  return (
    <div className="App">
      <h3>useStateValues</h3>
      <div className="box container">
        <Fushcia fuschia={stateValues.fuschia}>
          <Pink pink={stateValues.pink}>
            <Fushcia fuschia={stateValues.fuschia}>
              <Pink pink={stateValues.pink}></Pink>
            </Fushcia>
          </Pink>
        </Fushcia>
      </div>
    </div>
  );
}

export default App;
