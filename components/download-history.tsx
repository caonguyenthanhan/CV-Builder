"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History, Download, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DownloadRecord {
  id: string;
  fileName: string;
  timestamp: string;
  fullName: string;
  position: string;
}

export function DownloadHistory() {
  const [history, setHistory] = useState<DownloadRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadHistory = () => {
    const storedHistory = localStorage.getItem("cv_download_history");
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse download history", e);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadHistory();
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("cv_download_history");
    setHistory([]);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Lịch sử tải xuống">
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Lịch sử tải xuống</span>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500 hover:text-red-700 hover:bg-red-50 mr-4">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa lịch sử
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground mt-10">
              <History className="h-8 w-8 mb-2 opacity-20" />
              <p>Chưa có lịch sử tải xuống</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((record) => (
                <div key={record.id} className="flex flex-col space-y-1 p-3 border rounded-lg bg-slate-50">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm truncate pr-2" title={record.fileName}>
                      {record.fileName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{formatDate(record.timestamp)}</span>
                    <span className="truncate max-w-[150px]" title={`${record.fullName} - ${record.position}`}>
                      {record.fullName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
