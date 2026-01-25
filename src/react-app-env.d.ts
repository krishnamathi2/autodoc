/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_DEEPSEEK_API_KEY: string;
    REACT_APP_BACKEND_URL: string;
    REACT_APP_USE_AI: string;
    REACT_APP_VERSION: string;
  }
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}