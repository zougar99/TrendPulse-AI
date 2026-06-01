import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import FloatingAssistant from "../components/FloatingAssistant"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_idle",
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector("body")!

export default function FloatingUIMount() {
  return <FloatingAssistant />
}
