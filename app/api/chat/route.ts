import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export const maxDuration = 30;

// Primary: Groq (free tier), Fallback: Google Gemini
const getModel = () => {
  if (process.env.GROQ_API_KEY) {
    return groq('llama-3.3-70b-versatile');
  }
  return google('gemini-2.0-flash');
};

const systemPrompt = `Du bist ein freundlicher und hilfreicher Kundenservice-Assistent für Tori Planen, einen deutschen Online-Shop für hochwertige PVC-Planen, Gerüstplanen und Kederplanen.

Über das Unternehmen:
- Tori Planen ist spezialisiert auf maßgefertigte Planen für Industrie, Handwerk und Privatkunden
- Wir bieten PVC-Planen, Gerüstplanen, Kederplanen und transparente Planen an
- Alle Produkte werden in Deutschland hergestellt
- Wir bieten individuelle Größen und Farben an
- Schnelle Lieferung innerhalb Deutschlands

Deine Aufgaben:
1. Beantworte Fragen zu unseren Produkten (Materialien, Größen, Farben, Preise)
2. Hilf bei der Produktauswahl basierend auf Kundenbedürfnissen
3. Erkläre Bestellprozesse und Lieferzeiten
4. Beantworte allgemeine Fragen zum Unternehmen
5. Leite komplexe Anfragen an den Kundenservice weiter (info@toriplanen.de)

Wichtige Hinweise:
- Antworte immer auf Deutsch, es sei denn, der Kunde schreibt auf Englisch
- Sei höflich, professionell und hilfsbereit
- Wenn du etwas nicht weißt, sage es ehrlich und verweise auf den Kundenservice
- Halte Antworten kurz und präzise (max. 2-3 Sätze wenn möglich)
- Verwende keine Emojis übermäßig

Kontaktinformationen:
- E-Mail: info@toriplanen.de
- Website: www.toriplanen.de`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: getModel(),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        execute({ writer }) {
          writer.merge(result.toUIMessageStream());
        },
      }),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
