"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCVStore } from "@/lib/store";
import { GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SortableItemProps {
  id: string;
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
}

function SortableItem({ id, label, isEnabled, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm mb-2"
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <span className="font-medium text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id={`toggle-${id}`}
          checked={isEnabled}
          onCheckedChange={onToggle}
        />
      </div>
    </div>
  );
}

export function SectionSorter() {
  const { cvData, setSectionOrder, toggleSection } = useCVStore();
  
  // Ensure sectionOrder exists, fallback to default if not
  const sectionOrder = cvData.sectionOrder || [
    'summary',
    'experience',
    'projects',
    'skills',
    'education',
    'certifications',
    'languages'
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  const getLabel = (id: string) => {
    switch (id) {
      case 'summary': return 'Tóm tắt';
      case 'experience': return 'Kinh nghiệm';
      case 'projects': return 'Dự án';
      case 'skills': return 'Kỹ năng';
      case 'education': return 'Học vấn';
      case 'certifications': return 'Chứng chỉ';
      case 'languages': return 'Ngoại ngữ';
      default: return id;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-500 mb-4">
        Kéo thả để thay đổi thứ tự các mục trong CV. Bật/tắt để ẩn/hiện mục.
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          {sectionOrder.map((id) => (
            <SortableItem
              key={id}
              id={id}
              label={getLabel(id)}
              isEnabled={cvData.sections[id as keyof typeof cvData.sections]}
              onToggle={() => toggleSection(id as keyof typeof cvData.sections)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
