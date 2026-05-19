export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line/40">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-gold text-sm tracking-[0.22em]">ZONE</span>
          <span className="font-mono text-bone text-sm tracking-[0.22em]">27</span>
          <span className="text-mute text-xs ml-2">© 2026</span>
        </div>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] text-center">
          BUILT FOR THOSE WHO READ THE NUMBERS.
        </p>
      </div>
    </footer>
  );
}
