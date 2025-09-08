import { z } from "zod";

export const StepAction = z.enum([
  "click",
  "input",
  "scroll",
  "navigate",
  "keydown",
  "keyup",
  "hover",
  "wait",
  "custom"
]);

export const BoundingBox = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number()
}).optional();

export const Step = z.object({
  index: z.number(),
  action: StepAction,
  selector: z.string().optional(),
  selectorAlt: z.string().optional(),
  textSnippet: z.string().optional(),
  ariaRole: z.string().optional(),
  bbox: BoundingBox,
  scrollTop: z.number().optional(),
  scrollLeft: z.number().optional(),
  valueBefore: z.string().optional(),
  valueAfter: z.string().optional(),
  delayMs: z.number().optional(),
  screenshotUrl: z.string().optional(),
  caption: z.string().optional(),
});

export const Demo = z.object({
  title: z.string(),
  publicId: z.string(),
  createdAt: z.string().optional(),
  steps: z.array(Step),
});

// TypeScript types
export type StepAction = z.infer<typeof StepAction>;
export type BoundingBox = z.infer<typeof BoundingBox>;
export type Step = z.infer<typeof Step>;
export type Demo = z.infer<typeof Demo>;

// Type for the demo list item (used in the UI)
export interface DemoListItem {
  publicId: string;
  title: string;
  stepsCount: number;
  createdAt?: string;
}

// Type for demo details (full demo with steps)
export interface DemoDetails extends Omit<Demo, 'steps'> {
  steps: Step[];
}

// Validation functions
export function validateStep(step: unknown): Step {
  return Step.parse(step);
}

export function validateDemo(demo: unknown): Demo {
  return Demo.parse(demo);
}
