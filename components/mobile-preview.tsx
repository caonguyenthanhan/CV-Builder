"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { CVPreview } from "@/components/cv-preview";

export function MobilePreview() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-4 right-4 z-50 rounded-full shadow-xl md:hidden" size="lg">
          <Eye className="w-5 h-5 mr-2" />
          Xem trước
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Xem trước CV</DrawerTitle>
          <DrawerDescription>Kéo xuống để đóng</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
          <div className="bg-white shadow-sm min-h-full">
             <CVPreview hideToolbar={true} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
