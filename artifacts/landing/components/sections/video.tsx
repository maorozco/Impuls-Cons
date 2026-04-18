import { Play } from 'lucide-react';
import type { Messages } from '@/messages/types';

export function Video({ t }: { t: Messages['video'] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center max-w-3xl mx-auto">
          {t.h2}
        </h2>

        <div className="mt-12 mx-auto max-w-4xl">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-gradient-to-br from-card to-background group cursor-pointer transition-all hover:border-emerald/40">
            {/* Placeholder — the Replit agent or founder drops a real <video> or YouTube <iframe> here */}
            <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" aria-hidden />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-emerald/10 border border-emerald/40 backdrop-blur group-hover:bg-emerald/20 group-hover:scale-105 transition-all">
                <Play className="h-8 w-8 text-emerald fill-emerald translate-x-0.5" />
              </div>
              <span className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
                {t.placeholderLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
