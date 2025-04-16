"use client"

import { useRef } from "react"
import Editor from "@monaco-editor/react"

export default function CodeEditor() {
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  const defaultCode = ` // Bolierplate `

  return (
    <div className="h-full bg-[#0E1525] text-gray-300 font-mono">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={defaultCode}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
          renderLineHighlight: "all",
          cursorBlinking: "blink",
          automaticLayout: true,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  )
}
