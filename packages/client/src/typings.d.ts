/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.mp3' {
  const content: string;
  export default content;
}
