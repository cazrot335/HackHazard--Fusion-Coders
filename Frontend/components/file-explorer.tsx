"use client"

import { useState } from "react"
import {
  FileIcon,
  FolderIcon,
  RefreshCw,
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

// Initial file structure
const initialFiles = {
  root: [
    { name: ".git", type: "folder", children: [] },
    { name: "generated-icon.png", type: "file", extension: "png" },
    { name: "README.md", type: "file", extension: "md" },
    {
      name: "Config files",
      type: "category",
      children: [
        { name: "app.py", type: "file", extension: "python" },
        { name: "index.html", type: "file", extension: "html", active: true },
      ],
    },
  ],
}

export default function FileExplorer() {
  const [files, setFiles] = useState(initialFiles)
  const [expandedFolders, setExpandedFolders] = useState({})
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [currentPath, setCurrentPath] = useState("root")

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const handleRefresh = () => {
    // In a real app, this would fetch the latest file structure
    // For now, just simulate a refresh
    console.log("Refreshing file explorer...")
  }

  const startCreatingFile = () => {
    setIsCreatingFile(true)
    setIsCreatingFolder(false)
    setNewItemName("")
  }

  const startCreatingFolder = () => {
    setIsCreatingFolder(true)
    setIsCreatingFile(false)
    setNewItemName("")
  }

  const handleCreateItem = (e) => {
    e.preventDefault()

    if (!newItemName.trim()) return

    // In a real app, this would create the actual file/folder
    // For now, just update the state
    const newItem = {
      name: newItemName,
      type: isCreatingFile ? "file" : "folder",
      extension: isCreatingFile ? newItemName.split(".").pop() : null,
      children: isCreatingFolder ? [] : undefined,
    }

    // Add to current path (simplified for demo)
    setFiles((prev) => {
      const updated = { ...prev }
      updated.root = [...updated.root, newItem]
      return updated
    })

    // Reset state
    setIsCreatingFile(false)
    setIsCreatingFolder(false)
    setNewItemName("")
  }

  const renderFileIcon = (file) => {
    if (file.type === "folder") {
      return <FolderIcon className="w-4 h-4 mr-2 text-gray-400" />
    }
    return <FileIcon className="w-4 h-4 mr-2 text-gray-400" />
  }

  const renderFileTree = (fileList, path = "root", level = 0) => {
    return fileList.map((item, index) => {
      const itemPath = `${path}.${item.name}`
      const isExpanded = expandedFolders[itemPath]

      if (item.type === "category") {
        return (
          <div key={index} className="mt-4 mb-2">
            <div className="text-xs font-medium text-gray-400 px-2">{item.name}</div>
            <div className="ml-2">{item.children && renderFileTree(item.children, itemPath, level + 1)}</div>
          </div>
        )
      }

      if (item.type === "folder") {
        return (
          <div key={index}>
            <div
              className="flex items-center py-1 px-2 text-gray-300 hover:bg-[#2B3245] rounded cursor-pointer"
              onClick={() => toggleFolder(itemPath)}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 mr-1 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1 text-gray-400" />
              )}
              {renderFileIcon(item)}
              <span>{item.name}</span>
            </div>
            {isExpanded && item.children && (
              <div className="ml-4">{renderFileTree(item.children, itemPath, level + 1)}</div>
            )}
          </div>
        )
      }

      return (
        <div
          key={index}
          className={`flex items-center py-1 px-2 ${item.active ? "text-blue-400 bg-[#2B3245]" : "text-gray-300 hover:bg-[#2B3245]"} rounded cursor-pointer`}
        >
          {renderFileIcon(item)}
          <span>{item.name}</span>
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b border-[#2B3245]">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-gray-300"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-gray-300"
            onClick={startCreatingFile}
          >
            <FilePlus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-gray-300"
            onClick={startCreatingFolder}
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-300">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1C2333] border-[#2B3245] text-gray-300">
            <DropdownMenuItem onClick={startCreatingFile}>New File</DropdownMenuItem>
            <DropdownMenuItem onClick={startCreatingFolder}>New Folder</DropdownMenuItem>
            <DropdownMenuItem onClick={handleRefresh}>Refresh</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(isCreatingFile || isCreatingFolder) && (
        <form onSubmit={handleCreateItem} className="p-2 border-b border-[#2B3245]">
          <Input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={isCreatingFile ? "filename.ext" : "folder name"}
            className="w-full bg-[#0E1525] border border-[#2B3245] rounded text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        </form>
      )}

      <ScrollArea className="flex-1">
        <div className="p-2 text-sm">{renderFileTree(files.root)}</div>
      </ScrollArea>

      <div className="mt-auto border-t border-[#2B3245] p-2">
        <div className="flex justify-between">
          <Button variant="ghost" size="sm" className="text-xs text-gray-400" onClick={startCreatingFile}>
            File
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-gray-400" onClick={startCreatingFolder}>
            Folder
          </Button>
        </div>
      </div>
    </div>
  )
}
