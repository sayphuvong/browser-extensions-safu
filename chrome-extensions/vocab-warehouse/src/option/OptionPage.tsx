import { useEffect, useState } from "react";
import { WAREHOUSE_NAME } from "../constants";

function OptionPage() {
  const [vocab, setVocab] = useState({});

  useEffect(() => {
    const storageData = localStorage.getItem(WAREHOUSE_NAME) || "{}";
    console.log("@@@ storageData", JSON.parse(storageData));
    setVocab(JSON.parse(storageData));
  }, []);

  return (
    <section id="option-page">
      Hello Option Page
      <div>
        {Object.keys(vocab as any).map((item) => (
          <div>{item}</div>
        ))}
      </div>
    </section>
  );
}

export default OptionPage;
