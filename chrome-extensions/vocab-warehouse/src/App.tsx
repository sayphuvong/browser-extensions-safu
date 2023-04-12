import { useForm } from "react-hook-form";
import { ArrayInput } from "./components/ArrayInput";
import { InlineRichText } from "./components/InlineRichText";
import moment from "moment";
import { FaRegMehRollingEyes } from "react-icons/fa";
import { useEffect } from "react";

const WAREHOUSE_NAME = "VOCAB_WAREHOUSE";

interface VocabDataForm {
  word: string;
  definition: string;
  attribute: string;
  examples: string[];
}

interface VocabPayload {
  createdAt: string;
  updatedAt: string;
  word: string;
  attribute: string;
  definition: string;
  examples: string[];
}

function App() {
  const { register, handleSubmit, setValue, reset, getValues } =
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

  const onSubmit = (data: VocabDataForm) => {
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
  };

  return (
    <section className="extension-popup popup-wrapper relative">
      <FaRegMehRollingEyes
        className="w-[32px] h-[32px] text-red-500 cursor-pointer hover:opacity-50 active:opacity-70 absolute top-6 right-4"
        onClick={() => {
          let data = null;
          try {
            const dataFromStorage = localStorage.getItem(WAREHOUSE_NAME);
            if (!dataFromStorage) {
              console.log("WAREHOUSE_NAME => Empty!");
              alert("WAREHOUSE_NAME => Empty!");
              return;
            }
            data = JSON.parse(dataFromStorage);
          } catch (error) {
            console.log(
              `[Error] There is error when parse WAREHOUSE_NAME data!`
            );
            alert(`[Error] There is error when parse WAREHOUSE_NAME data!`);
            return;
          }

          console.log("WAREHOUSE_NAME:", JSON.stringify(data, undefined, 2));
          alert(JSON.stringify(data, undefined, 2));
        }}
      />
      <p className="uppercase font-bold text-xl text-center mb-8 mx-auto w-[80%] text-[#E86A33]">
        Add your vocab into warehouse
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center"
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

        <label className="app-label" htmlFor="example">
          Example
        </label>
        <ArrayInput prefixName="examples">
          {({ name, prefixName, index }) => {
            console.log('@@@ getValues()', getValues());
            return (
              <InlineRichText
                value={getValues().examples?.[index] || ""}
                placeholder={`${prefixName} ${index + 1}`}
                onMount={() => register(name as any)}
                onChange={(value) => {
                  setValue(name as any, value);
                }}
              />
            );
          }}
        </ArrayInput>

        <input type="submit" className="btn btn-blue" />
      </form>
    </section>
  );
}

export default App;
