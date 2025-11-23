import { Coffee } from "lucide-react";

interface AnimatedCoffeeIconProps {
  size?: "sm" | "md" | "lg" | "xl";
}

export default function AnimatedCoffeeIcon({ size = "lg" }: AnimatedCoffeeIconProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32 md:w-40 md:h-40",
    xl: "w-40 h-40 md:w-48 md:h-48"
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5 md:w-3 md:h-3",
    xl: "w-3 h-3 md:w-4 md:h-4"
  };

  return (
    <div className="relative inline-block group">
      {/* Steam dots */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${dotSizes[size]} bg-primary/60 rounded-full animate-steam`}
            style={{
              animationDelay: `${i * 0.3}s`,
              animationDuration: "1.5s"
            }}
          />
        ))}
      </div>
      
      {/* Coffee icon */}
      <Coffee 
        className={`${sizeClasses[size]} text-primary group-hover:rotate-12 transition-transform duration-300 filter drop-shadow-2xl`} 
      />
    </div>
  );
}
