"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircleIcon, XIcon } from "lucide-react";

interface VideoPlayerProps {
  videoKey: string;
  title?: string;
  btnText?: string;
  variant?: "default" | "secondary" | "outline";
}

export function VideoPlayer({ 
  videoKey, 
  title,
  btnText = "Watch Trailer",
  variant = "secondary"
}: VideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant={variant} 
        className="flex items-center gap-2 font-medium"
        onClick={() => setIsOpen(true)}
      >
        <PlayCircleIcon className="h-4 w-4" />
        {btnText}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px] max-w-[95vw] max-h-[90vh] p-0 border-none bg-transparent shadow-2xl">
          <div className="relative pt-[56.25%] w-full rounded-lg overflow-hidden">
            <button 
              className="absolute top-3 right-3 z-10 rounded-full bg-black/70 p-2 hover:bg-black/90 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="h-5 w-5 text-white" />
            </button>
            <iframe
              className="absolute top-0 left-0 w-full h-full bg-black"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              title={title || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 