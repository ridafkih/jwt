export default function CodeBlock({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <code className={`text-xs leading-6 w-full break-all bg-neutral-900 p-4 rounded-sm ${className}`}>
      {children}
    </code>
  );
}
