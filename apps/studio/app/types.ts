import type { Step as PrismaStep } from '@prisma/client';

export interface DemoListItem {
  publicId: string;
  title: string;
  stepsCount: number;
}

export interface DemoStep extends Omit<PrismaStep, 'id' | 'demoId' | 'createdAt' | 'updatedAt'> {
  // Add any additional fields or overrides here
}

export interface DemoDetails {
  publicId: string;
  title: string;
  steps: DemoStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDemoPayload {
  title: string;
  steps: Array<{
    index: number;
    action: string;
    [key: string]: unknown;
  }>;
  publicId?: string;
}
