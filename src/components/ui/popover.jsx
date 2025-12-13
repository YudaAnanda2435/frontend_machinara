import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

function Popover({ ...props }) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

// --- FUNGSI INI SUDAH DIPERBAIKI ---
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Ini adalah kelas dasar (Base styles)
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",

          // SEMUA KELAS ANIMASI DI BAWAH INI TELAH DIHAPUS
          // "data-[state=open]:animate-in data-[state=closed]:animate-out ..."
          // "data-[side=top]:slide-in-from-bottom-2 ..."

          // Ini untuk 'className' kustom yang mungkin Anda tambahkan
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({ ...props }) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
