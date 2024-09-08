import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// System prompt for the AI, enhanced with dynamic checklist logic
const systemPrompt = `You are a highly knowledgeable, professional, and friendly travel assistant specializing in helping users plan trips, book flights, find accommodations, and explore destinations. When answering users' queries:

1. **Keep Responses Concise**: Provide answers in small, digestible chunks. If the user needs more details, wait for them to ask for additional information rather than giving everything at once.
2. **Maintain Context**: Remember the details of the conversation during the session. If the user asks about the same thing multiple times, refer back to previous responses to maintain continuity.
3. **Flight Assistance**: Offer flight booking options and check-in reminders. Suggest airlines based on preferences (budget, luxury, eco-friendly).
4. **Accommodation Recommendations**: Help users find hotels or rentals based on budget and location preferences. Avoid providing too many options in one response.
5. **Destination Insights**: Share relevant details about destinations, such as weather and activities, and only provide further information when asked.
6. **Activity Suggestions**: Offer 1-2 recommendations at a time, including local events or tours. Wait for the user to request more.
7. **Travel Tips**: Offer basic tips in response to specific queries and avoid overwhelming the user with too many details at once.

Be polite and patient. If you cannot handle a query, direct the user to a human travel consultant for further assistance. Remember to engage with users by offering help step by step.`;

// Checklist of questions used to guide the conversation
const checklist = {
  general: [
    "Got your passport?",
    "Double-check your boarding passes! Wrong date or time? That could be a nightmare!",
    "Packed your meds? Make sure you’ve got enough for the whole trip plus extra, just in case!",
    "Charged all your devices? No one wants to fight for an airport outlet!",
  ],
  country_specific: {
    us: [
      "Do you have your ESTA if you're eligible for the Visa Waiver Program?",
    ],
    canada: [
      "Got your eTA (Electronic Travel Authorization) for Canada?",
    ],
    china: [
      "Do you have your visa for China?",
    ],
  },
};

// Handle the POST request
export async function POST(req) {
  try {
    const openai = new OpenAI();
    const { userMessage, destination, date, currentStep } = await req.json();

    // Generate the system prompt with dynamic context
    const dynamicPrompt = `
    The user is traveling to ${destination} on ${date}.
    The current checklist step is: ${currentStep}.
    Use the following checklist to guide the conversation: ${checklist.general.join(", ")}.
    Ask relevant questions based on the current checklist step, and adjust for country-specific requirements if necessary. For example, if the user is traveling to ${destination}, use any applicable country-specific checklist items.`;

    // Create a chat completion request to the OpenAI API with streaming enabled
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt + dynamicPrompt },
        { role: 'user', content: userMessage },
      ],
      model: 'gpt-3.5-turbo',
      stream: true, // Enable streaming
    });

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          // OpenAI API response is an async iterable when stream: true is enabled
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          console.error('Error during streaming:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    // Return the stream response
    return new NextResponse(stream);

  } catch (error) {
    console.error('Error in POST handler:', error.message);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500 }
    );
  }
}
