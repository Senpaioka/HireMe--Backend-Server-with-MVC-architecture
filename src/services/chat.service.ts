
import OpenAI from 'openai';
import { Job } from '../models/job.model';
import config from '../config/env';

const openai = new OpenAI({
  apiKey: config.openai_api_key,
});

export const chatWithAssistant = async (message: string, userId?: string) => {
  
  // 🔥 Optional: fetch jobs from DB for context
  const jobs = await Job.find().limit(5).select('title location company');

  const context = jobs.map(job => 
    `${job.title} at ${job.company} (${job.location})`
  ).join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `
You are a smart job assistant.
Help users find jobs, improve resumes, and give career advice.

Available jobs:
${context}
        `,
      },
      {
        role: 'user',
        content: message,
      },
    ],
  });

  return response.choices[0].message.content;
};