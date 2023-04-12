import {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import keys from "lodash/keys";
import debounce from "lodash/debounce";
import "../index.css";

import {
  WAREHOUSE_NAME,
  NUMBER_ONLY,
  VOCAB_GRID,
  MESSAGE_KEYS,
} from "../constants";
import { getInitColumns, getInitRows } from "../utils";
import useChromeMessage from "../hooks/useChromeMessage";

function OptionPage() {
  const [vocab, setVocab] = useState({});
  const [columns, setColumns] = useState(getInitColumns);
  const [wordsOnColumn, setWordsOnColumn] = useState(getInitRows);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const words = keys(vocab);

  useChromeMessage({
    onResponse: (request) => {
      console.log("@@@ request", {
        request,
        check: request.message?.key === MESSAGE_KEYS.refreshOptionPage,
        'MESSAGE_KEYS.refreshOptionPage': MESSAGE_KEYS.refreshOptionPage,
        'request.message?.key': request.message?.key,
        
      });

      if (request.message?.key === MESSAGE_KEYS.refreshOptionPage) {
        loadVocabDataFromStorage();
      }
    },
  });

  useEffect(() => {
    console.log("@@@ mounted");
  }, []);

  const handleColumnsChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      let newColumns = VOCAB_GRID.cols;
      if (NUMBER_ONLY.test(value)) {
        newColumns = +value;
      }

      setColumns(newColumns);
      localStorage.setItem("cols", String(newColumns));
    }, 500),
    []
  );

  const handleRowsChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      let newRows = VOCAB_GRID.rows;
      if (NUMBER_ONLY.test(value)) {
        newRows = +value;
      }

      setWordsOnColumn(newRows);
      localStorage.setItem("rows", String(newRows));
    }, 500),
    []
  );

  const loadVocabDataFromStorage = () => {
    try {
      const storageData = localStorage.getItem(WAREHOUSE_NAME) || "{}";
      setVocab(JSON.parse(storageData));
    } catch (err) {
      console.log("[Error] Parse vocab data\n", err);
    }
  };

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(loadVocabDataFromStorage, []);

  return (
    <section id="option-page" className="flex flex-col h-[100vh]">
      <div ref={headerRef}>
        <div className="flex items-center gap-4 uppercase text-xl text-[#F9D949] font-black py-4 bg-slate-600 pl-4">
          <span>Vocabulary Warehouse</span>
          <div className="flex items-center gap-2">
            <label htmlFor="cols" className="text-base font-normal lowercase">
              Cols
            </label>
            <input
              id="cols"
              className="w-[60px] font-normal text-sm text-center text-red-400 px-3 rounded-sm"
              placeholder="cols"
              onChange={(e) => handleColumnsChange(e)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="rows" className="text-base font-normal lowercase">
              Rows
            </label>
            <input
              id="rows"
              className="w-[60px] font-normal text-sm text-center text-red-400 px-3 rounded-sm"
              placeholder="rows"
              onChange={(e) => handleRowsChange(e)}
            />
          </div>
        </div>
      </div>
      <div
        className={`flex-1 relative overflow-x-auto shadow-md h-[calc(100vh-${headerHeight}px)]`}
      >
        <div className="flex gap-1 min-h-[100%]">
          {[...Array(columns)].map((_, colIndex) => (
            <div className="flex-1 flex flex-col gap-1 h-[100%] border-2 border-gray-400">
              {[...Array(wordsOnColumn)].map((_, wordIndex) => (
                <div
                  className={`flex-1 flex items-center py-2 px-4 hover:bg-yellow-100 cursor-pointer`}
                >
                  <span className="font-semibold text-[#4AA96C]">
                    {words[wordsOnColumn * colIndex + wordIndex] || "_"}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OptionPage;
