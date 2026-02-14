import { useState } from "react";
import { 
  Plus, 
  Search, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Archive, 
  MoreHorizontal, 
  Edit, 
  History, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock Data for Content
const MOCK_CONTENT = [
  { id: "Mod-101", title: "Intro to Welding Safety", type: "Module", lastUpdated: "2024-02-10", status: "Published", author: "Admin" },
  { id: "Quiz-A1", title: "Basic Grammar Assessment", type: "Quiz", lastUpdated: "2024-02-12", status: "Published", author: "Sarah C." },
  { id: "Vocab-Mech", title: "Automotive Terminology V2", type: "Vocabulary", lastUpdated: "2024-01-20", status: "Archived", author: "Admin" },
  { id: "Task-W-05", title: "Write Essay: Remote Work", type: "Practice Task", lastUpdated: "2024-02-14", status: "Draft", author: "John D." },
  { id: "Mod-102", title: "Advanced TIG Techniques", type: "Module", lastUpdated: "2023-11-05", status: "Published", author: "Mike R." },
  { id: "Quiz-Tech", title: "Safety Signs & Symbols", type: "Quiz", lastUpdated: "2024-02-01", status: "Published", author: "Admin" },
];

export function ContentManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("All");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const filteredContent = MOCK_CONTENT.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = contentTypeFilter === "All" || item.type === contentTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleSave = () => {
    setIsEditOpen(false);
    toast({
      title: "Content Updated",
      description: `Successfully saved changes to ${editingItem?.id || "new item"}.`,
      className: "bg-green-50 border-green-200"
    });
  };

  const handleArchive = (id: string) => {
    toast({
      title: "Content Archived",
      description: `Item ${id} has been moved to archive.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search content by title or ID..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Module">Modules</SelectItem>
              <SelectItem value="Quiz">Quizzes</SelectItem>
              <SelectItem value="Vocabulary">Vocabulary</SelectItem>
              <SelectItem value="Practice Task">Practice Tasks</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4" /> Create New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Content" : "Create New Content"}</DialogTitle>
              <DialogDescription>
                {editingItem ? `Editing ${editingItem.id}. Changes are tracked in version history.` : "Add a new module, quiz, or task to the LMS."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select defaultValue={editingItem?.type || "Module"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Module">Learning Module</SelectItem>
                      <SelectItem value="Quiz">Quiz / Assessment</SelectItem>
                      <SelectItem value="Vocabulary">Vocabulary List</SelectItem>
                      <SelectItem value="Practice Task">Practice Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue={editingItem?.status || "Draft"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Review">In Review</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Title</Label>
                <Input defaultValue={editingItem?.title || ""} placeholder="e.g. Advanced Welding Safety" />
              </div>

              <div className="space-y-2">
                <Label>Content / Description</Label>
                <Textarea 
                  className="min-h-[150px] font-mono text-sm" 
                  placeholder="# Content goes here (Markdown supported)..."
                  defaultValue={editingItem ? "Loading content..." : ""}
                />
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
                 <History className="h-4 w-4 shrink-0 mt-0.5" />
                 <div>
                    <strong>Version Control:</strong> Saving this will create a new version (v{editingItem ? "2.1" : "1.0"}). Previous versions can be restored from the History tab.
                 </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Content Repository</CardTitle>
          <CardDescription>
             Manage learning materials, assessments, and practice resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-slate-500">{item.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {item.type === "Module" && <BookOpen className="h-4 w-4 text-blue-500" />}
                      {item.type === "Quiz" && <HelpCircle className="h-4 w-4 text-purple-500" />}
                      {item.type === "Vocabulary" && <FileText className="h-4 w-4 text-orange-500" />}
                      {item.type === "Practice Task" && <Edit className="h-4 w-4 text-green-500" />}
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === "Published" ? "default" : 
                      item.status === "Draft" ? "secondary" : "outline"
                    } className={
                      item.status === "Published" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" : 
                      item.status === "Draft" ? "bg-slate-100 text-slate-700 hover:bg-slate-100" : 
                      "text-slate-500"
                    }>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{item.lastUpdated}</TableCell>
                  <TableCell className="text-sm text-slate-500">{item.author}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Content
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="mr-2 h-4 w-4" /> View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleArchive(item.id)}>
                          <Archive className="mr-2 h-4 w-4" /> Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Version Control Info Alert */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-900">
           <History className="w-5 h-5 text-blue-600 shrink-0" />
           <div>
              <h4 className="font-bold mb-1">Version Control Enabled</h4>
              <p className="text-blue-800/80">
                 All edits are automatically versioned (v1.0, v1.1, etc.). You can rollback to previous versions from the history menu.
                 Content marked as "Draft" is sandbox-only and invisible to students.
              </p>
           </div>
        </div>

        {/* Content Review Policy */}
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 text-sm text-amber-900">
           <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
           <div>
              <h4 className="font-bold mb-1">Review Frequency Policy</h4>
              <p className="text-amber-800/80">
                 <strong>Quarterly Review Required:</strong> All content must be verified every 3 months.
                 <br />
                 <span className="text-xs uppercase tracking-wide font-bold mt-1 inline-block opacity-70">Next Audit Due: May 15, 2026</span>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
