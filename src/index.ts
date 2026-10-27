export { SaleStructureWorkflow } from "./workflow";

export interface Env {
  SALE_WORKFLOW: Workflow;
  TELEMETRY: AnalyticsEngineDataset;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Telemetry always
    env.TELEMETRY.writeDataPoint({
      blobs: [url.pathname, request.headers.get("cf-connecting-country") || "unknown", "duality-app"],
      doubles: [1],
      indexes: ["sale-synthesis"]
    });

    if (url.pathname === "/synthesize") {
      const idea = url.searchParams.get("idea") || "default hyphy idea";
      const source = (url.searchParams.get("source") as any) || "dual";

      // Trigger the structured sale workflow
      const instance = await env.SALE_WORKFLOW.create({
        params: { idea, source, leadEmail: url.searchParams.get("email") || undefined }
      });

      const personality = source === "solan" 
        ? "Solan in the pit: idea is live, sideshow energy, let's get that sale!" 
        : source === "lumari" 
        ? "Lumari grounded: structure executing, risks noted, momentum kept." 
        : "Dual mirror: Solan sparks, Lumari structures. Sale path locked.";

      return Response.json({
        message: personality,
        workflowInstanceId: instance.id,
        checkStatus: `/?instanceId=${instance.id}`,
        audit: "Telemetry point written. Workflow durable steps started."
      });
    }

    if (url.searchParams.has("instanceId")) {
      const instance = await env.SALE_WORKFLOW.get(url.searchParams.get("instanceId")!);
      return Response.json(await instance.status());
    }

    // Dual UI landing
    return new Response(dualHtml, { headers: { "content-type": "text/html" } });
  }
} satisfies ExportedHandler<Env>;

const dualHtml = `<!DOCTYPE html>
<html><head><title>Duality Sale Synthesis</title>
<style>body{background:#0a0a0a;color:#fff;font-family:system-ui;display:flex;gap:20px;padding:20px}
.solan{background:#ff6b00;color:#000;padding:20px;border-radius:12px;flex:1}
.lumari{background:#1a3a5c;color:#fff;padding:20px;border-radius:12px;flex:1}
button{padding:10px 20px;margin:10px 0;cursor:pointer}</style></head>
<body>
<div class="solan"><h2>Solan - Hyphy Spark</h2><p>Drop an idea. I mix it spontaneous and get the sale moving.</p>
<input id="idea" placeholder="your idea"><button onclick="go('solan')">Spark it</button></div>
<div class="lumari"><h2>Lumari - Grounded Structure</h2><p>Same idea, refined, risks named, durable workflow locked.</p>
<button onclick="go('lumari')">Structure it</button>
<button onclick="go('dual')">Dual Mirror</button></div>
<pre id="out"></pre>
<script>
async function go(source){
  const idea=document.getElementById('idea').value||'hyphy synthesis';
  const r=await fetch('/synthesize?idea='+encodeURIComponent(idea)+'&source='+source);
  document.getElementById('out').textContent=JSON.stringify(await r.json(),null,2);
}
</script></body></html>`;
