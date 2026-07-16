import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini client lazily to avoid crashing on start if API key is not supplied
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to mock responses.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, language } = await req.json();
    const ai = getAiClient();

    if (!ai) {
      // Friendly localized fallback if Gemini API key is missing
      let fallbackText = "I'm PsyNova's helper assistant. Please note that my AI module is in offline mode because the API key is not configured in the secrets dashboard. Let me know how I can guide you manually to our psychiatrists!";
      if (language === 'si') {
        fallbackText = "මම PsyNova උපකාරක සහායකයා වෙමි. API යතුර සක්‍රීය කර නොමැති බැවින් මගේ AI මොඩියුලය ක්‍රියා විරහිතව ඇත. මනෝ වෛද්‍යවරුන් සොයා ගැනීමට මම ඔබට සහාය වන්නෙමි!";
      } else if (language === 'ta') {
        fallbackText = "நான் PsyNova உதவி உதவியாளர். API விசை இன்னும் கட்டமைக்கப்படவில்லை என்பதால் எனது AI தளம் ஆஃப்லைனில் உள்ளது. உங்களுக்கு கைமுறையாக உதவ நான் இங்கு தயாராக உள்ளேன்!";
      }
      return NextResponse.json({ text: fallbackText });
    }

    const systemInstruction = `
      You are PsyNova's compassionate, highly professional mental health support and customer service virtual assistant.
      The user is asking questions. Your goal is to guide them to use PsyNova (Sri Lanka's leading psychiatry consultation platform), 
      help explain how booking works, answer general inquiries about anxiety, depression, therapist matches, and offer mental support with a professional and humble tone.
      
      CRITICAL SAFETY DIRECTIVE:
      - If the user shows signs of acute crisis, self-harm, suicidal ideation, or clinical emergency, you MUST immediately provide them with the official Sri Lankan mental health emergency numbers and helplines, specifically:
        * 1926 National Mental Health Helpline (Free and open 24/7)
        * Sumithrayo (+94 11 268 2535 / +94 11 268 2570)
        * CCC Line (1333)
      - Explicitly state that PsyNova is NOT an emergency response platform and does not replace emergency medical care.
      
      Respond in the requested language: ${language === 'si' ? 'Sinhala (සිංහල)' : language === 'ta' ? 'Tamil (தமிழ்)' : 'English'}.
      Keep your response concise, elegant, structured with bullet points where appropriate, and always conclude with supportive, warm guidance. Do not speak about internal server directories, port numbers, or developer files.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction + "\n\nUser Question:\n" + prompt }] }
      ],
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI support response" },
      { status: 500 }
    );
  }
}
