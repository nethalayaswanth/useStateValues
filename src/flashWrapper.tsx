import React, { useState, useRef, useEffect, ReactNode } from "react";

const FlashComponent = ({
  children,
  delay = 200,
}: {
  children: ReactNode;
  delay: number;
}) => {
  const [render, forceRender] = useState(0);
  const highlight = useRef(true);

  useEffect(() => {
    highlight.current = true;
  }, [render]);

  useEffect(() => {
    const timer = setTimeout(() => {
      highlight.current = false;
      forceRender((x) => x + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      highlight.current = false;
      forceRender((x) => x + 1);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  });

  const style = highlight.current ? "highlight" : "";
  return <div className={`flash ${style}`}>{children}</div>;
};

export default FlashComponent;
