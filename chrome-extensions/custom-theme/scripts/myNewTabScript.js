const btnSettingOpen = document.getElementById("btn-setting-open");
const btnSettingClose = document.getElementById("btn-setting-close");
const settingPanel = document.getElementById("panel-setting");
const bgBrowseInput = document.getElementsByClassName("bg-browse-input")[0];

btnSettingOpen.addEventListener("click", openSettingPanel);
btnSettingClose.addEventListener("click", closeSettingPanel);
bgBrowseInput.addEventListener("change", handleBgInputChange);

init();

function openSettingPanel() {
  settingPanel.classList.remove("hidden");
}

function closeSettingPanel() {
  settingPanel.classList.add("hidden");
}

function handleBgInputChange(e) {
  const file = e.target.files[0];

  const reader = new FileReader();
  reader.addEventListener("load", handleBgLoaded);
  reader.readAsDataURL(file);
}

function handleBgLoaded(e) {
  try {
    const readerResult = e.currentTarget.result;
    setBackground(readerResult);
    localStorage.setItem("backgroundFileResult", readerResult);
  } catch (err) {
    console.log("[Error] Background load by File Reader\n", err);
  }
}

function setBackground(imageUrl) {
  const bgRootEl = document.getElementById("bg-root-element");
  bgRootEl.classList.remove("bg-loading");
  bgRootEl.style.backgroundImage = `url(${imageUrl})`;
}

function init() {
  const backgroundUrl = localStorage.getItem("backgroundFileResult");
  if (backgroundUrl) {
    setBackground(backgroundUrl);
  }
}
