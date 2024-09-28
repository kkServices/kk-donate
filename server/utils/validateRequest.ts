import type { H3Event } from 'h3';
import type { ZodType } from 'zod';

export async function validateRequest<T>(schema: ZodType<T>, event: H3Event) {
  const getRequest = event.method === 'GET' ? getQuery : readBody;
  const parseResult = schema.safeParse(await getRequest(event));

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: parseResult.error.errors[0].message,
    });
  }

  return parseResult.data;
}
