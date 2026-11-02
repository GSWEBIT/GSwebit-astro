import type { APIRoute } from 'astro';
import { connectDB } from '../../../../lib/db';
import { Inquiry } from '../../../../lib/models/Inquiry';
import { isAuthorizedAdmin } from '../../../../lib/auth';
import { jsonResponse, optionsResponse } from '../../../../lib/cors';

export const prerender = false;

export const OPTIONS: APIRoute = async ({ request }) => {
  return optionsResponse(request);
};

export const GET: APIRoute = async ({ request }) => {
  if (!isAuthorizedAdmin(request)) {
    return jsonResponse(
      { error: 'Unauthorized: Missing or invalid token' },
      401,
      request
    );
  }

  try {
    await connectDB();
    const items = await Inquiry.find().sort({ createdAt: -1 }).lean();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let today = 0;
    let week = 0;
    let month = 0;
    const topicCounts: Record<string, number> = {};

    items.forEach((item: any) => {
      const d = new Date(item.createdAt);
      if (d >= startOfToday) today++;
      if (d >= startOfWeek) week++;
      if (d >= startOfMonth) month++;
      const t = item.topic || 'General';
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });

    const byTopic = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);

    return jsonResponse(
      {
        items,
        stats: {
          total: items.length,
          today,
          week,
          month,
          byTopic,
        },
      },
      200,
      request
    );
  } catch (err: any) {
    console.error('Admin inquiries error:', err);
    return jsonResponse(
      { error: err.message || 'Failed to fetch inquiries' },
      500,
      request
    );
  }
};

