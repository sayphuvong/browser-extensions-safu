import { useEffect } from "react";
import { checkIsChromeRuntime } from "../utils";
import { ChromeRuntimeMsg } from "../types";

interface Props {
  onResponse: (
    request: { message: ChromeRuntimeMsg },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => void;
}

const useChromeMessage = ({ onResponse }: Props) => {
  useEffect(() => {
    if (!checkIsChromeRuntime()) {
      return;
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
      onResponse(request, sender, sendResponse)
    );
  }, []);
};

export default useChromeMessage;
