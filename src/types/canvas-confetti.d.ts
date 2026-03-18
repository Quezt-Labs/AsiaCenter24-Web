declare module "canvas-confetti" {
  interface Options {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
  }
  const confetti: (options?: Options) => Promise<null>;
  export default confetti;
}
