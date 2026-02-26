"use client";

import React from "react";
import { useCVStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileJson } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DataManager() {
  const { cvData, setCVData } = useCVStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cvData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `cv_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          if (event.target?.result) {
            const parsedData = JSON.parse(event.target.result as string);
            // Basic validation check
            if (parsedData.personalInfo && parsedData.experience) {
              setCVData(parsedData);
              setIsOpen(false);
              alert("Import thành công!");
            } else {
              alert("File JSON không hợp lệ.");
            }
          }
        } catch (error) {
          console.error("Import Error:", error);
          alert("Có lỗi xảy ra khi đọc file.");
        }
      };
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={handleExport} className="gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm">
        <Download className="w-4 h-4" />
        Export JSON
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2 bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-sm">
            <Upload className="w-4 h-4" />
            Import JSON
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Dữ liệu CV</DialogTitle>
            <DialogDescription>
              Tải lên file JSON đã backup trước đó để khôi phục dữ liệu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5 py-4">
            <Label htmlFor="json-file">File Backup (JSON)</Label>
            <Input id="json-file" type="file" accept=".json" onChange={handleImport} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
