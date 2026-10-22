import { NextResponse } from "next/server";

/**
 * Standardized API Error & Response Wrapper
 * Ensures that under NO circumstance do raw PostgreSQL or Neon driver internal
 * errors, stack traces, or credentials leak to the client in HTTP responses.
 */

export function successResponse(data, status = 200, headers = {}) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      ...headers,
    },
  });
}

export function errorResponse(message, status = 500, logContext = {}) {
  // Log full error details securely on the server / Vercel runtime logs
  if (status >= 500) {
    console.error(`[API Error] [${status}] ${message}`, logContext);
  } else {
    console.warn(`[API Warning] [${status}] ${message}`, logContext);
  }

  // Sanitized message for client response
  const clientMessage =
    status >= 500
      ? "An unexpected error occurred while processing your request. Please try again later."
      : message;

  return NextResponse.json(
    { error: clientMessage },
    {
      status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

/**
 * Wraps an asynchronous Next.js route handler with standardized try/catch and logging.
 *
 * @param {Function} handler (req, context) => Promise<NextResponse>
 * @returns {Function}
 */
export function withErrorHandler(handler) {
  return async function (req, context) {
    try {
      return await handler(req, context);
    } catch (err) {
      const isDbError =
        err?.name?.includes("Neon") ||
        err?.message?.includes("connect") ||
        err?.message?.includes("database") ||
        err?.code?.startsWith("42") ||
        err?.code?.startsWith("08");

      const status = isDbError ? 503 : 500;
      return errorResponse(
        isDbError
          ? "Database service currently undergoing maintenance. Please retry shortly."
          : err?.message || "Internal server error",
        status,
        {
          path: req?.nextUrl?.pathname || req?.url,
          error: err?.message,
          code: err?.code,
          stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
        }
      );
    }
  };
}
