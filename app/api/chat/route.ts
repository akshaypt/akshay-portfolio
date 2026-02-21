export async function POST(req: Request) {
    const { message } = await req.json();
  
    let reply = "";
  
    const lowerMessage = message.toLowerCase();
  
    if (lowerMessage.includes("hiring")) {
      reply = "That's great! Akshay is open to discussing product leadership roles. You can book a meeting using the booking option.";
    } 
    else if (lowerMessage.includes("startup")) {
      reply = "Akshay has founder experience and can help with 0→1 product strategy, GTM, and retention frameworks.";
    }
    else if (lowerMessage.includes("growth")) {
      reply = "Akshay has worked on growth experiments that improved DAU by 23% and retention by 40%. Would you like to see that case study?";
    }
    else {
      reply = "Hi, I'm AI Akshay 👋 Ask me about product strategy, hiring, startup help, or growth work.";
    }
  
    return Response.json({ reply });
  }
  