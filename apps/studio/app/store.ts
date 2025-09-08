import { prisma } from "../lib/prisma";
import type { Demo } from "@microdemo/schema";
import { Demo as ZDemo } from "@microdemo/schema";

export interface DemoListItem {
  publicId: string;
  title: string;
  stepsCount: number;
}

export interface DemoStep {
  index: number;
  action: "click" | "input" | "scroll" | "navigate" | "keydown" | "keyup" | "hover" | "wait" | "custom";
  selector?: string;
  selectorAlt?: string;
  textSnippet?: string;
  ariaRole?: string;
  bbox?: { x: number; y: number; width: number; height: number };
  scrollTop?: number;
  scrollLeft?: number;
  valueBefore?: string;
  valueAfter?: string;
  delayMs?: number;
  screenshotUrl?: string;
  caption?: string;
}

export interface DemoDetails {
  title: string;
  publicId: string;
  steps: DemoStep[];
}

// In-memory fallback for local dev if DB is unavailable
const mem: Demo[] = [];

export async function listDemos(): Promise<DemoListItem[]> {
  try {
    const rows = await prisma.demo.findMany({
      orderBy: { createdAt: "desc" },
      select: { publicId: true, title: true, _count: { select: { steps: true } } },
    });
    return rows.map((r) => ({
      publicId: r.publicId,
      title: r.title,
      stepsCount: r._count.steps,
    }));
  } catch {
    return mem
      .slice()
      .reverse()
      .map((d) => ({ publicId: d.publicId, title: d.title, stepsCount: d.steps.length }));
  }
}

export async function getDemo(publicId: string): Promise<DemoDetails | null> {
  try {
    const d = await prisma.demo.findUnique({
      where: { publicId },
      include: { steps: { orderBy: { index: "asc" } } },
    });
    if (!d) return null;
    return {
      title: d.title,
      publicId: d.publicId,
      steps: d.steps.map((s) => ({
        index: s.index,
        action: s.action as DemoStep['action'],
        selector: s.selector ?? undefined,
        selectorAlt: s.selectorAlt ?? undefined,
        textSnippet: s.textSnippet ?? undefined,
        ariaRole: s.ariaRole ?? undefined,
        bbox: s.bboxW && s.bboxH ? { x: s.bboxX!, y: s.bboxY!, width: s.bboxW!, height: s.bboxH! } : undefined,
        scrollTop: s.scrollTop ?? undefined,
        scrollLeft: s.scrollLeft ?? undefined,
        valueBefore: s.valueBefore ?? undefined,
        valueAfter: s.valueAfter ?? undefined,
        delayMs: s.delayMs ?? undefined,
        screenshotUrl: s.screenshotUrl ?? undefined,
        caption: s.caption ?? undefined,
      })),
    };
  } catch {
    const d = mem.find((m) => m.publicId === publicId);
    if (!d) return null;
    return {
      title: d.title,
      publicId: d.publicId,
      steps: d.steps as unknown as DemoStep[],
    };
  }
}

export async function createDemo(payload: unknown): Promise<{ publicId: string }> {
  const parsed = ZDemo.parse(payload);
  const publicId = parsed.publicId ?? Math.random().toString(36).slice(2, 10);
  try {
    await prisma.demo.create({
      data: {
        publicId,
        title: parsed.title,
        steps: {
          create: parsed.steps.map((s) => ({
            index: s.index,
            action: s.action,
            selector: s.selector,
            selectorAlt: s.selectorAlt,
            textSnippet: s.textSnippet,
            ariaRole: s.ariaRole,
            bboxX: s.bbox?.x,
            bboxY: s.bbox?.y,
            bboxW: s.bbox?.width,
            bboxH: s.bbox?.height,
            scrollTop: s.scrollTop,
            scrollLeft: s.scrollLeft,
            valueBefore: s.valueBefore,
            valueAfter: s.valueAfter,
            delayMs: s.delayMs,
            screenshotUrl: s.screenshotUrl,
            caption: s.caption,
          })),
        },
      },
    });
  } catch {
    // fallback: store in memory for local/dev use
    mem.push({ title: parsed.title, publicId, steps: parsed.steps } as Demo);
  }
  return { publicId };
}
