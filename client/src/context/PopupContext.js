import { createContext } from 'react';

const PopupContext = createContext({
  popups: [],
  setPopups: () => {},
  dispatchPopup: () => {}
});

export { PopupContext };