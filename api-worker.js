const ALLOWED_ORIGINS = [
  "https://botnest.in",
  "https://www.botnest.in",
  "https://sid18le21-ui.github.io"
];


function getCorsHeaders(origin) {

  const allowed =
    ALLOWED_ORIGINS.includes(origin)
      ? origin
      : "https://botnest.in";


  return {
    "Access-Control-Allow-Origin": allowed,

    "Access-Control-Allow-Methods":
      "GET, POST, OPTIONS",

    "Access-Control-Allow-Headers":
      "Content-Type",

    "Access-Control-Max-Age":
      "86400",

    "Cache-Control":
      "no-store"
  };
}


export default {

  async fetch(request, env) {

    const origin =
      request.headers.get("Origin") || "";

    const corsHeaders =
      getCorsHeaders(origin);


    /*
     * CORS preflight
     */

    if (request.method === "OPTIONS") {

      return new Response(
        null,
        {
          status: 204,
          headers: corsHeaders
        }
      );
    }


    /*
     * Only GET and POST are needed.
     */

    if (
      request.method !== "GET" &&
      request.method !== "POST"
    ) {

      return new Response(
        JSON.stringify({
          success: false,
          message: "Method not allowed."
        }),
        {
          status: 405,

          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json; charset=utf-8"
          }
        }
      );
    }


    /*
     * Apps Script URL is stored as a
     * Cloudflare environment variable/secret.
     */

    const appsScriptUrl =
      env.APPS_SCRIPT_URL;


    if (!appsScriptUrl) {

      return new Response(
        JSON.stringify({
          success: false,
          message:
            "API backend is not configured."
        }),
        {
          status: 500,

          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json; charset=utf-8"
          }
        }
      );
    }


    try {

      let body = undefined;


      if (request.method === "POST") {

        body =
          await request.text();
      }


      const upstream =
        await fetch(
          appsScriptUrl,
          {
            method: request.method,

            headers: {
              "Content-Type":
                "application/json"
            },

            body: body,

            redirect: "follow"
          }
        );


      const responseText =
        await upstream.text();


      return new Response(
        responseText,
        {
          status: upstream.status,

          headers: {
            ...corsHeaders,

            "Content-Type":
              "application/json; charset=utf-8"
          }
        }
      );


    } catch (error) {

      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Unable to reach BotNest backend."
        }),
        {
          status: 502,

          headers: {
            ...corsHeaders,

            "Content-Type":
              "application/json; charset=utf-8"
          }
        }
      );
    }
  }
};
