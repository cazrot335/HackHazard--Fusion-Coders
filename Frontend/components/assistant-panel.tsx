import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AssistantPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-[#2B3245] flex items-center">
        <Button variant="ghost" size="sm" className="text-gray-300 flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span>New chat</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="w-24 h-24 mb-4 text-gray-500">
            <MessageSquare className="w-full h-full" />
          </div>
          <h3 className="text-xl font-semibold mb-2">New chat with Assistant</h3>
          <p className="text-gray-400 mb-6">Assistant answers questions, refines code, and makes precise edits.</p>

          <div className="grid grid-cols-2 gap-2 w-full max-w-md">
            <Button variant="outline" className="bg-[#2B3245] hover:bg-[#3B4255] border-[#3B4255] text-gray-300">
              Inspect 
            </Button>
            <Button variant="outline" className="bg-[#2B3245] hover:bg-[#3B4255] border-[#3B4255] text-gray-300">
              Improve 
            </Button>
            <Button variant="outline" className="bg-[#2B3245] hover:bg-[#3B4255] border-[#3B4255] text-gray-300">
              Brainstorm 
            </Button>
            <Button variant="outline" className="bg-[#2B3245] hover:bg-[#3B4255] border-[#3B4255] text-gray-300">
              Add dark mode 
            </Button>
            <Button variant="outline" className="bg-[#2B3245] hover:bg-[#3B4255] border-[#3B4255] text-gray-300">
              Optimize 
            </Button>
            <Button variant="outline" className="bg-[#2B3245] hover:bg-[#3B4255] border-[#3B4255] text-gray-300">
              Explain
            </Button>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-[#2B3245]">
        <div className="relative">
          <textarea
            placeholder="Ask Assistant, use @ to include specific files..."
            className="w-full bg-[#0E1525] border border-[#2B3245] rounded-md pl-3 pr-10 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[40px] resize-none"
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
