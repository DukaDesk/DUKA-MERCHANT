import { describe, expect, it, vi } from "vitest";
import { applyBuilderAgentProposal, buildBuilderAgentSystemPrompt, createBuilderAgentPlan, parseBuilderAgentResponse } from "./builderAgent";

const design = {
  meta: { appName: "Test Desk", category: "Restaurant", primaryColor: "#1A1A2E" },
  navigation: { initialScreen: "screen_1", tabs: [] },
  screens: { screen_1: { name: "Home", backgroundColor: "#FCF8FA", bodySections: [] } },
  shared: { header: { components: [] }, footer: { components: [] } },
};

describe("DukaDesk Builder Agent", () => {
  it("grounds its system prompt in registered components and the current design", () => {
    const prompt = buildBuilderAgentSystemPrompt({
      ...design,
      screens: { screen_1: { ...design.screens.screen_1, bodySections: [{ name: "Current content", components: [{ type: "text_block", props: { text: "not sent" } }] }] } },
    });
    expect(prompt).toContain("OUT OF SCOPE");
    expect(prompt).toContain('"id":"screen_1"');
    expect(prompt).toContain('"type":"hero_banner"');
    expect(prompt).toContain('"type":"text_block"');
    expect(prompt).not.toContain('"text":"not sent"');
    expect(prompt).toContain("Never generate executable code");
  });

  it("parses structured JSON and fenced JSON responses", () => {
    const response = { scope: "out_of_scope", reply: "Backend API work is not in the builder." };
    expect(parseBuilderAgentResponse(JSON.stringify(response))).toEqual(response);
    expect(parseBuilderAgentResponse(`\`\`\`json\n${JSON.stringify(response)}\n\`\`\``)).toEqual(response);
  });

  it("rejects malformed response contracts", () => {
    expect(() => parseBuilderAgentResponse("not json")).toThrow("valid design proposal");
    expect(() => parseBuilderAgentResponse('{"scope":"unknown","reply":"No"}')).toThrow("builder contract");
  });

  it("applies a valid visual proposal to a cloned design and strips unsafe props", () => {
    const response = {
      scope: "in_scope",
      reply: "I drafted the home screen.",
      proposal: {
        app: { appName: "Morning Table", primaryColor: "#B45309" },
        screens: [{
          id: "screen_1",
          name: "Home",
          mode: "replace",
          sections: [{
            name: "Welcome",
            components: [
              { type: "hero_banner", props: { title: "Fresh every day", onClick: "alert(1)", script: "bad", unknown: true, textStyles: { title: { action: "execute", color: "#FFFFFF" } } } },
              { type: "image_block", props: { src: "https://example.test/image.png", alt: "Unapproved remote image" } },
              { type: "hero_banner", props: { fill: { type: "image", value: "data:image/png;base64,AAAA" } } },
            ],
          }],
        }],
      },
    };

    const updated = applyBuilderAgentProposal(design, response);

    expect(updated).not.toBe(design);
    expect(updated.meta.appName).toBe("Morning Table");
    expect(updated.screens.screen_1.bodySections[0].components[0].props.title).toBe("Fresh every day");
    expect(updated.screens.screen_1.bodySections[0].components[0].props).not.toHaveProperty("onClick");
    expect(updated.screens.screen_1.bodySections[0].components[0].props).not.toHaveProperty("script");
    expect(updated.screens.screen_1.bodySections[0].components[0].props).not.toHaveProperty("unknown");
    expect(updated.screens.screen_1.bodySections[0].components[1].props.src).toBe("");
    expect(updated.screens.screen_1.bodySections[0].components[2].props.fill).toEqual({ type: "image" });
    expect(updated.screens.screen_1.bodySections[0].components[0].props.textStyles.title).not.toHaveProperty("action");
    expect(design.screens.screen_1.bodySections).toHaveLength(0);
  });

  it("rejects out-of-scope and unregistered component proposals", () => {
    expect(() => applyBuilderAgentProposal(design, { scope: "out_of_scope" })).toThrow("Only in-scope");
    expect(() => applyBuilderAgentProposal(design, {
      scope: "in_scope",
      proposal: { screens: [{ id: "screen_1", mode: "replace", sections: [{ components: [{ type: "custom_code" }] }] }] },
    })).toThrow("Unsupported component type");
  });

  it("refuses explicit backend and provider integration requests before calling AI", async () => {
    const requestCompletion = vi.fn();
    const response = await createBuilderAgentPlan("Integrate Paystack for payment processing", design, requestCompletion);

    expect(response.scope).toBe("out_of_scope");
    expect(response.reply).toContain("outside the builder agent's current scope");
    expect(requestCompletion).not.toHaveBeenCalled();
  });

  it("includes bounded conversation context for clarification follow-ups", async () => {
    const requestCompletion = vi.fn().mockResolvedValue(JSON.stringify({ scope: "needs_clarification", reply: "Which services?" }));
    const history = Array.from({ length: 10 }, (_, index) => ({ role: "user", text: `Message ${index}` }));
    await createBuilderAgentPlan("Show them as cards", design, requestCompletion, "screen_1", history);

    const request = JSON.parse(requestCompletion.mock.calls[0][0].prompt);
    expect(request.currentScreenId).toBe("screen_1");
    expect(request.conversation).toHaveLength(8);
    expect(request.conversation[0].text).toBe("Message 2");
    expect(request.request).toBe("Show them as cards");
  });
});