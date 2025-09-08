import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export type BBox = { x: number; y: number; width: number; height: number };

export type DemoStep = {
  index: number;
  action: string;
  selector?: string;
  selectorAlt?: string;
  textSnippet?: string;
  ariaRole?: string;
  bbox?: BBox;
  scrollTop?: number;
  scrollLeft?: number;
  valueBefore?: string;
  valueAfter?: string;
  delayMs?: number;
  screenshotUrl?: string;
  caption?: string;
};

export type DemoDetails = {
  title: string;
  publicId: string;
  steps: DemoStep[];
};

export type DemoListItem = {
  publicId: string;
  title: string;
  stepsCount: number;
};
