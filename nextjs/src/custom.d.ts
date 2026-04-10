/// <reference types="next" />

// Declare CSS files as modules to allow side-effect imports (e.g. import './styles.css')
declare module '*.css' {
  const content: Record<string, string>
  export default content
}
