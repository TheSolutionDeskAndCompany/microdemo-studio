import { Demo } from "@microdemo/schema";

interface DemoStore {
  list: () => Demo[];
  get: (id: string) => Demo | undefined;
  create: (demo: Demo) => Demo;
}

const demos: Demo[] = [];

export const demoStore: DemoStore = {
  list() {
    return demos;
  },
  get(id: string) {
    return demos.find((d) => d.publicId === id);
  },
  create(demo: Demo) {
    if (!demo.publicId) {
      demo.publicId = `demo_${Date.now()}`;
    }
    demo.createdAt = new Date().toISOString();
    demos.push(demo);
    return demo;
  },
};
