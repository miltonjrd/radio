import { createContext } from "react";

const MusicPlayerContext = createContext({
  active: false,
  setActive: () => {},
  playing: null,
});

export { MusicPlayerContext };