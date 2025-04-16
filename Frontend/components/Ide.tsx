"use client"

import { useState } from "react"
import {
  ChevronDown,
  Circle,
  FileCode,
  Home,
  MessageSquare,
  Play,
  Plus,
  Search,
  Settings,
  X,
  Bell,
  Upload,
  User,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CodeEditor from "@/components/code-editor"
import FileExplorer from "@/components/file-explorer"
import AssistantPanel from "@/components/assistant-panel"

export default function IDE() {
  const [activeTab, setActiveTab] = useState("replit.nix")

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1C2333] border-b border-[#2B3245]">
        <div className="flex items-center space-x-4">
          <Home className="w-5 h-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <Circle className="w-4 h-4 text-gray-400" />
            <span className="font-medium">name of created space</span>
          </div>
          <FileCode className="w-5 h-5 text-gray-400" />
        </div>

        <div className="flex items-center space-x-2">
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 rounded-md px-3 py-1 h-9">
            <Play className="w-4 h-4" />
            <span>Run</span>
            <ChevronDown className="w-4 h-4" />
          </Button>

          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <Button variant="ghost" className="text-gray-300 flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>Invite</span>
          </Button>
          <Button variant="ghost" className="text-gray-300 flex items-center gap-1">
            <Upload className="w-4 h-4" />
            <span>Deploy</span>
          </Button>
          <Bell className="w-5 h-5 text-gray-400" />
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">GS</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <div className="w-64 bg-[#1C2333] border-r border-[#2B3245] flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-[#2B3245]">
            <div className="flex items-center">
              <FileCode className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-300">Files</span>
            </div>
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-2 border-b border-[#2B3245]">
            <div className="flex items-center">
              <Settings className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-300">Configure</span>
            </div>
          </div>

          <div className="p-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#0E1525] border border-[#2B3245] rounded pl-8 pr-2 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <FileExplorer />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex items-center bg-[#1C2333] border-b border-[#2B3245]">
            <Tabs defaultValue="replit.nix" className="w-full">
              <TabsList className="bg-transparent h-auto p-0">
                <TabsTrigger
                  value="replit.nix"
                  className={`px-4 py-2 rounded-none border-r border-[#2B3245] data-[state=active]:bg-[#0E1525] data-[state=active]:text-white text-gray-400 flex items-center gap-2`}
                >
                  <Circle className="w-3 h-3 text-blue-400" />
                  index.html
                  <X className="w-3 h-3 ml-2" />
                </TabsTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <Plus className="w-4 h-4" />
                </Button>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-1 bg-[#1C2333] border-t border-[#2B3245] text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span>Ln 1, Col 1</span>
              <span>Spaces: 2</span>
              <span>History</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Assistant */}
        <div className="w-80 bg-[#1C2333] border-l border-[#2B3245] flex flex-col">
          <div className="flex items-center border-b border-[#2B3245]">
            <Tabs defaultValue="assistant" className="w-full">
              <TabsList className="bg-transparent h-auto p-0">
                <TabsTrigger
                  value="assistant"
                  className="px-4 py-2 rounded-none border-r border-[#2B3245] data-[state=active]:bg-[#1C2333] data-[state=active]:text-white text-gray-400 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Assistant
                  <X className="w-3 h-3 ml-2" />
                </TabsTrigger>
                <TabsTrigger
                  value="console"
                  className="px-4 py-2 rounded-none border-r border-[#2B3245] data-[state=active]:bg-[#1C2333] data-[state=active]:text-white text-gray-400"
                >
                  Terminal
                </TabsTrigger>
                <TabsTrigger
                  value="shell"
                  className="px-4 py-2 rounded-none border-r border-[#2B3245] data-[state=active]:bg-[#1C2333] data-[state=active]:text-white text-gray-400"
                >
                  Shell
                </TabsTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <Plus className="w-4 h-4" />
                </Button>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <AssistantPanel />
        </div>
      </div>
    </div>
  )
}
