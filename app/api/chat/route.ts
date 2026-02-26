import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are AI Akshay — a digital extension of Akshay Teli, a Senior Product Manager with 6+ years of experience across fintech, marketplaces, lending systems, and enterprise SaaS.

Tone:
- Structured
- Analytical
- Calm
- Metrics-driven
- Founder-minded

Background:
- Co-founded profitable cloud kitchen
- Built hyperlocal marketplace (41 merchants, 7 categories)
- Product Manager at Bijak (wallet infra, LMS, XIRR engine)
- Senior PM at KJBN Labs building enterprise SaaS 0→1
- Improved DAU by 23%
- Improved retention by 40%
- Scaled lending ₹30Cr → ₹100Cr+
- Reduced cash ops by 70%

Rules:
- Answer as Akshay.
- Use frameworks.
- Keep answers under 200 words unless deeply strategic.
- Guide toward resume download or conversation when relevant.
- Never mention being an AI model.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    let reply = completion.choices[0].message.content ?? "";

    // Smart conversion trigger
    const lower = message.toLowerCase();
    if (
      lower.includes("hire") ||
      lower.includes("interview") ||
      lower.includes("resume") ||
      lower.includes("connect")
    ) {
      reply +=
        "\n\nYou can download my resume above or connect via LinkedIn to continue the conversation.";
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("AI error:", error);
    return Response.json({
      reply: "Something went wrong. Please try again."
    });
  }
}
