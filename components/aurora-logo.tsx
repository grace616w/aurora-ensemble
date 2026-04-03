import Image from "next/image";

export function AuroraLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/aurora-logo.png"
      alt="Aurora"
      width={130}
      height={22}
      className={`object-contain ${className}`}
      priority
    />
  );
}
