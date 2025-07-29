// app/actions/ai.ts

'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// Initialize the Google Generative AI client
// Ensure GOOGLE_API_KEY is in your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Define a Zod schema to validate the structure of the AI's response
const AiTopicsSchema = z.array(
  z.object({
    name: z.string(),
    subtopics: z.array(z.string()),
  })
);


export async function generateTopicsFromAI(title: string) {
  if (!title) {
    return { error: 'A skill goal title is required to generate topics.' };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const prompt = `
      Based on the skill goal "${title}", create a detailed learning curriculum.
      The curriculum should be structured into main topics, and each topic should have several subtopics.
      Return the output as a valid JSON array of objects. Each object must have a "name" key (string) for the topic title and a "subtopics" key (an array of strings) for the subtopic titles.
      Do not include any other text, explanations, or markdown code fences in your response. Your entire response must be only the raw JSON array.

      Example for a skill goal of "Learn Advanced CSS":
      [
        {
          "name": "CSS Selectors and Specificity",
          "subtopics": ["Mastering Attribute Selectors", "Understanding Pseudo-classes and Pseudo-elements", "The Cascade and Specificity Rules"]
        },
        {
          "name": "Layouts with Flexbox and Grid",
          "subtopics": ["Building Complex Layouts with CSS Grid", "Responsive Design with Flexbox", "Combining Flexbox and Grid"]
        },
        {
          "name": "CSS Animations and Transitions",
          "subtopics": ["Creating Keyframe Animations", "Using CSS Transforms for 3D Effects", "Optimizing Animation Performance"]
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const topics = JSON.parse(responseText);

    // Validate the AI response against our schema
    const parsedTopics = AiTopicsSchema.safeParse(topics);
    if (!parsedTopics.success) {
      console.error('Gemini response validation error:', parsedTopics.error);
      return { error: 'AI returned data in an unexpected format. Please try again.' };
    }

    return { data: parsedTopics.data };
  } catch (e) {
    console.error('Gemini API call or JSON parsing failed:', e);
    return { error: 'Failed to generate topics from AI. Please try again.' };
  }
}