export default function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-playfair tracking-wide leading-7 text-sm">{children}</p>
  );
}
