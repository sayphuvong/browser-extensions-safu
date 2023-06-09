import { useCallback, useEffect, useState } from "react";
import RichTextEditor from "react-rte";
import styled from "styled-components";
import debounce from "lodash/debounce";

const RichTextEditorStyled = styled(RichTextEditor)`
  & {
    border: 1px solid #808080;
  }
  & [class^="EditorToolbar__root"] {
    display: none;
  }
  & .public-DraftStyleDefault-block {
    font-family: arial;
    height: 20px;
    display: flex;
    align-items: center;
  }
  & .public-DraftEditor-content {
    padding: 12px 16px;
  }
  & .public-DraftEditorPlaceholder-root {
    padding: 12px 16px;
    font-family: arial;
    font-size: 1rem;
  }
`;

interface InlineRichTextProps {
  name: string;
  placeholder: string;
  onMount: () => void;
  onChange: (value: string) => void;
  getValue: () => string;
}

export function InlineRichText(props: InlineRichTextProps) {
  const { name, getValue, placeholder, onMount, onChange } = props;
  const value = getValue();

  const [emptyToolbar] = useState({
    display: [],
    INLINE_STYLE_BUTTONS: [],
    BLOCK_TYPE_DROPDOWN: [],
    BLOCK_TYPE_BUTTONS: [],
    BLOCK_ALIGNMENT_BUTTONS: [],
  });

  const [rteValue, setRteValue] = useState(() =>
    RichTextEditor.createEmptyValue()
  );

  console.log("@@@ rteValue", rteValue.toString("html"));

  const htmlContent = rteValue.toString("html");

  const handleValueOnChange = useCallback(
    debounce((value) => {
      onChange(value);
    }, 200),
    []
  );

  useEffect(() => {
    onMount();
  }, []);

  useEffect(() => {
    handleValueOnChange(htmlContent);
  }, [handleValueOnChange, htmlContent]);

  useEffect(() => {
    setRteValue((prev) =>
      value !== prev.toString("html")
        ? RichTextEditor.createValueFromString(value, "html")
        : prev
    );
  }, [value]);

  return (
    <div>
      <RichTextEditorStyled
        placeholder={placeholder}
        value={rteValue}
        onChange={setRteValue}
        toolbarConfig={emptyToolbar}
      />
    </div>
  );
}
