import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from "cloudflare:workers";

type SaleParams = {
  idea: string;
  leadEmail?: string;
  source: "solan" | "lumari" | "dual";
};

export class SaleStructureWorkflow extends WorkflowEntrypoint<Env, SaleParams> {
  async run(event: WorkflowEvent<SaleParams>, step: WorkflowStep) {
    // Step 1: Capture & Synthesize (Solan energy)
    const synthesized = await step.do("synthesize-idea", async () => {
      const idea = event.payload.idea;
      // Mix similar category methods: formulas + strategies + dual personalities
      return {
        refinedIdea: `Hyphy mix: ${idea} + edge lead scoring + durable steps`,
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        dualNote: "Solan sparks the pitch, Lumari locks the structure"
      };
    });

    // Step 2: Sleep / nurture delay (realistic sales timing)
    await step.sleep("nurture-window", "2 hours");

    // Step 3: Score & route (Lumari grounding)
    const scored = await step.do(
      "score-and-route",
      {
        retries: { limit: 3, delay: "10 seconds", backoff: "exponential" }
      },
      async () => {
        if (synthesized.score >= 80) {
          return { status: "hot", action: "immediate-sale-push", email: event.payload.leadEmail };
        }
        return { status: "warm", action: "drip-sequence", email: event.payload.leadEmail };
      }
    );

    // Step 4: Execute structure (get the sale)
    const result = await step.do("execute-sale-structure", async () => {
      // In real: Stripe charge, HubSpot update, Buffer post, etc.
      return {
        executed: true,
        next: scored.action,
        telemetryLogged: true,
        dualClose: "Sale structure locked. Duality complete."
      };
    });

    return { synthesized, scored, result };
  }
}
