import { useReducer } from 'react';

// État initial
const initialState = {
  originalPicture: null,
  currentPicture: null,
  rotation: 0,
  brightness: 100,
  contrast: 100,
  red: 100,
  green: 100,
  blue: 100,
  blackAndWhite: false,
};

// Types d'actions
export const ACTIONS = {
  SET_ORIGINAL_PICTURE: 'SET_ORIGINAL_PICTURE',
  SET_CURRENT_PICTURE: 'SET_CURRENT_PICTURE',
  SET_ROTATION: 'SET_ROTATION',
  SET_BRIGHTNESS: 'SET_BRIGHTNESS',
  SET_CONTRAST: 'SET_CONTRAST',
  SET_RED: 'SET_RED',
  SET_GREEN: 'SET_GREEN',
  SET_BLUE: 'SET_BLUE',
  TOGGLE_BLACK_AND_WHITE: 'TOGGLE_BLACK_AND_WHITE',
  RESET: 'RESET',
};

// Reducer
function imageEditorReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_ORIGINAL_PICTURE:
      return { ...state, originalPicture: action.payload };
    case ACTIONS.SET_CURRENT_PICTURE:
      return { ...state, currentPicture: action.payload };
    case ACTIONS.SET_ROTATION:
      return { ...state, rotation: action.payload };
    case ACTIONS.SET_BRIGHTNESS:
      return { ...state, brightness: action.payload };
    case ACTIONS.SET_CONTRAST:
      return { ...state, contrast: action.payload };
    case ACTIONS.SET_RED:
      return { ...state, red: action.payload };
    case ACTIONS.SET_GREEN:
      return { ...state, green: action.payload };
    case ACTIONS.SET_BLUE:
      return { ...state, blue: action.payload };
    case ACTIONS.TOGGLE_BLACK_AND_WHITE:
      return { ...state, blackAndWhite: !state.blackAndWhite };
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}

// Hook custom
export default function useImageEditor() {
  const [state, dispatch] = useReducer(imageEditorReducer, initialState);

  // Actions (fonctions vides pour l'instant)
  const setOriginalPicture = (picture) => {
    dispatch({ type: ACTIONS.SET_ORIGINAL_PICTURE, payload: picture });
    // TODO: Implémenter la logique
  };

  const setCurrentPicture = (picture) => {
    dispatch({ type: ACTIONS.SET_CURRENT_PICTURE, payload: picture });
    // TODO: Implémenter la logique
  };

  const rotate = (degrees) => {
    dispatch({ type: ACTIONS.SET_ROTATION, payload: degrees });
    // TODO: Implémenter la logique de rotation
  };

  const adjustBrightness = (value) => {
    dispatch({ type: ACTIONS.SET_BRIGHTNESS, payload: value });
    // TODO: Implémenter la logique de luminosité
  };

  const adjustContrast = (value) => {
    dispatch({ type: ACTIONS.SET_CONTRAST, payload: value });
    // TODO: Implémenter la logique de contraste
  };

  const adjustRed = (value) => {
    dispatch({ type: ACTIONS.SET_RED, payload: value });
    // TODO: Implémenter la logique de canal rouge
  };

  const adjustGreen = (value) => {
    dispatch({ type: ACTIONS.SET_GREEN, payload: value });
    // TODO: Implémenter la logique de canal vert
  };

  const adjustBlue = (value) => {
    dispatch({ type: ACTIONS.SET_BLUE, payload: value });
    // TODO: Implémenter la logique de canal bleu
  };

  const toggleBlackAndWhite = () => {
    dispatch({ type: ACTIONS.TOGGLE_BLACK_AND_WHITE });
    // TODO: Implémenter la logique noir et blanc
  };

  const reset = () => {
    dispatch({ type: ACTIONS.RESET });
    // TODO: Implémenter la logique de réinitialisation
  };

  return {
    state,
    actions: {
      setOriginalPicture,
      setCurrentPicture,
      rotate,
      adjustBrightness,
      adjustContrast,
      adjustRed,
      adjustGreen,
      adjustBlue,
      toggleBlackAndWhite,
      reset,
    },
  };
}

