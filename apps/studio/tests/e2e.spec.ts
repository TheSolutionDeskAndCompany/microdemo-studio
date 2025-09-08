import { test, expect } from "@playwright/test";

const STUDIO = "http://localhost:3000";

test.describe("Microdemo Studio", () => {
  test("create demo and fetch public", async ({ request }) => {
    const payload = {
      title: "E2E Demo",
      steps: [
        { index: 0, action: "click", selector: "#login", caption: "Click Login" },
        { 
          index: 1, 
          action: "input", 
          selector: "input[name=email]", 
          caption: "Enter email (masked)" 
        },
      ],
    };

    // Create a new demo
    const createResponse = await request.post(`${STUDIO}/api/demos`, { 
      data: payload 
    });
    
    expect(createResponse.ok()).toBeTruthy();
    const createData = await createResponse.json();
    
    expect(createData.ok).toBe(true);
    expect(createData.publicId).toBeTruthy();

    // Fetch the created demo
    const publicResponse = await request.get(
      `${STUDIO}/api/public/${createData.publicId}`
    );
    
    expect(publicResponse.ok()).toBeTruthy();
    const publicData = await publicResponse.json();
    
    expect(publicData.ok).toBe(true);
    expect(publicData.demo.title).toBe("E2E Demo");
    expect(publicData.demo.steps.length).toBe(2);
    expect(publicData.demo.steps[0].action).toBe("click");
    expect(publicData.demo.steps[1].action).toBe("input");
  });

  test("handle non-existent demo", async ({ request }) => {
    const response = await request.get(
      `${STUDIO}/api/public/non-existent-id`
    );
    
    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe("Demo not found");
  });
});
