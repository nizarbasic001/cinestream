const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TMDB_BASE = "https://api.themoviedb.org/3";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const tmdbApiKey = Deno.env.get("TMDB_API_KEY");
    if (!tmdbApiKey) {
      return new Response(
        JSON.stringify({ error: "TMDB API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint");

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: "Missing endpoint parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEndpoint = endpoint.replace(/^\/+/, "");

    const tmdbUrl = new URL(`${TMDB_BASE}/${cleanEndpoint}`);
    tmdbUrl.searchParams.set("api_key", tmdbApiKey);

    const skipKeys = ["endpoint"];
    for (const [key, value] of url.searchParams.entries()) {
      if (!skipKeys.includes(key)) {
        tmdbUrl.searchParams.set(key, value);
      }
    }

    const tmdbResponse = await fetch(tmdbUrl.toString(), {
      headers: { "Accept": "application/json" },
    });

    if (!tmdbResponse.ok) {
      const errorText = await tmdbResponse.text();
      console.error(`TMDB API error: ${tmdbResponse.status}`, errorText);
      return new Response(
        JSON.stringify({ error: `TMDB API returned ${tmdbResponse.status}` }),
        { status: tmdbResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await tmdbResponse.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("TMDB proxy error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch from TMDB" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
