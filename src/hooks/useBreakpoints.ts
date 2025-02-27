import { useMediaQuery } from "react-responsive";

// Define breakpoints with proper typing
const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

type BreakpointKey = keyof typeof breakpoints;

const useBreakpoint = <K extends string>(breakpointKey: K) => {
  // Ensure breakpointKey exists in our breakpoints
  const breakpointValue =
    breakpoints[breakpointKey as unknown as BreakpointKey] || "640px";

  const bool = useMediaQuery({
    query: `(max-width: ${breakpointValue})`,
  });

  const capitalizedKey =
    breakpointKey[0].toUpperCase() + breakpointKey.substring(1);

  type KeyAbove = `isAbove${Capitalize<K>}`;
  type KeyBelow = `isBelow${Capitalize<K>}`;

  return {
    [breakpointKey]: Number(String(breakpointValue).replace(/[^0-9]/g, "")),
    [`isAbove${capitalizedKey}`]: !bool,
    [`isBelow${capitalizedKey}`]: bool,
  } as Record<K, number> & Record<KeyAbove | KeyBelow, boolean>;
};

export default useBreakpoint;
