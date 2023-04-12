import { NUMBER_ONLY, VOCAB_GRID } from "../constants";

export const checkIsChromeRuntime = () => {
  return typeof chrome === "object" && !!chrome.runtime;
};

export const getInitColumns = () => {
  const columnsInStorage = localStorage.getItem("cols") || "";
  if (NUMBER_ONLY.test(columnsInStorage)) {
    return +columnsInStorage;
  }
  return VOCAB_GRID.cols;
};

export const getInitRows = () => {
  const rowsInStorage = localStorage.getItem("rows") || "";
  if (NUMBER_ONLY.test(rowsInStorage)) {
    return +rowsInStorage;
  }
  return VOCAB_GRID.rows;
};
