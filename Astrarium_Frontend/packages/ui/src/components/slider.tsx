import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const currentValue = value[0] ?? 0;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onValueChange?.([newValue]);
    };

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <input
          type="range"
          ref={ref}
          className="slider-input h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary outline-none transition-opacity hover:opacity-100"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--secondary)) ${percentage}%, hsl(var(--secondary)) 100%)`
          }}
          value={currentValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        <style>{`
          .slider-input::-webkit-slider-thumb {
            appearance: none;
            width: 1rem;
            height: 1rem;
            border-radius: 9999px;
            background: hsl(var(--primary));
            cursor: pointer;
            border: 2px solid hsl(var(--background));
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          }
          .slider-input::-moz-range-thumb {
            width: 1rem;
            height: 1rem;
            border-radius: 9999px;
            background: hsl(var(--primary));
            cursor: pointer;
            border: 2px solid hsl(var(--background));
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          }
          .slider-input:focus-visible::-webkit-slider-thumb {
            outline: 2px solid hsl(var(--ring));
            outline-offset: 2px;
          }
          .slider-input:focus-visible::-moz-range-thumb {
            outline: 2px solid hsl(var(--ring));
            outline-offset: 2px;
          }
        `}</style>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
