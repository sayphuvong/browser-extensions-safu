import { useForm } from "react-hook-form";
import { ArrayInput } from "./components/ArrayInput";
import { InlineRichText } from "./components/InlineRichText";
import moment from "moment";
import { AiFillSetting } from "react-icons/ai";
import { MESSAGE_KEYS, WAREHOUSE_NAME } from "./constants";
import { checkIsChromeRuntime } from "./utils";
import type { VocabDataForm, VocabPayload } from "./types";

function App() {
  const { register, handleSubmit, setValue, reset, resetField ,getValues } =
    useForm<VocabDataForm>();

  const getVocabFromStorage = () => {
    let result: Record<VocabPayload["word"], VocabPayload[]> = {};
    try {
      const data = localStorage.getItem(WAREHOUSE_NAME) || "{}";
      result = JSON.parse(data);
    } catch {}
    return result;
  };

  const saveVocabIntoStorage = (vocabData: VocabPayload) => {
    const prevVocabularies = getVocabFromStorage();
    const exitedWord = prevVocabularies[vocabData.word];

    let newVocab = null;
    if (!!exitedWord && Object.keys(exitedWord).length > 0) {
      newVocab = [...exitedWord, vocabData];
    } else {
      newVocab = [vocabData];
    }

    prevVocabularies[vocabData.word] = newVocab;
    localStorage.setItem(WAREHOUSE_NAME, JSON.stringify(prevVocabularies));
  };

  const onSubmit = async (data: VocabDataForm) => {
    const createdAt = moment().toISOString();
    saveVocabIntoStorage({
      createdAt,
      updatedAt: createdAt,
      word: data.word,
      attribute: data.attribute,
      definition: data.definition,
      examples: data.examples,
    });
    reset();
    resetField('examples');

    await chrome.runtime.sendMessage({
      message: { key: MESSAGE_KEYS.refreshOptionPage, data: null },
    });
  };

  const redirectToOptionPage = () => {
    if (!checkIsChromeRuntime()) {
      window.open("/option");
    } else if (typeof chrome.runtime.openOptionsPage === "function") {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  };

  return (
    <section className="extension-popup popup-wrapper relative">
      <AiFillSetting
        className="w-[32px] h-[32px] text-red-500 cursor-pointer opacity-80 hover:opacity-100 active:opacity-70 absolute top-4 right-4"
        onClick={redirectToOptionPage}
      />
      <p className="uppercase font-bold text-xl text-center mb-8 mx-auto w-[80%] text-[#E86A33]">
        Add your vocab into warehouse
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center"
      >
        <label className="app-label" htmlFor="word">
          Word
        </label>
        <input
          className="app-input"
          id="word"
          type="text"
          placeholder="word"
          {...register("word")}
        />

        <label className="app-label" htmlFor="attribute">
          Attribute
        </label>
        <input
          className="app-input"
          id="attribute"
          type="text"
          placeholder="attribute"
          {...register("attribute")}
        />

        <label className="app-label" htmlFor="definition">
          Definition
        </label>
        <input
          className="app-input"
          id="definition"
          type="text"
          placeholder="definition"
          {...register("definition")}
        />

        <label className="app-label" htmlFor="example">
          Example
        </label>
        <ArrayInput prefixName="examples">
          {({ name, prefixName, index }) => {
            console.log("@@@ getValues()", getValues());
            return (
              <InlineRichText
                key={`${prefixName} ${index + 1}`}
                name={`examples.${index}`}
                getValue={() => getValues().examples?.[index] || ""}
                placeholder={`${prefixName} ${index + 1}`}
                onMount={() => register(name as any)}
                onChange={(value) => {
                  setValue(`examples.${index}` as any, value);
                }}
              />
            );
          }}
        </ArrayInput>

        <input type="submit" className="btn" />
      </form>
    </section>
  );
}

export default App;
