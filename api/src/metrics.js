import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

function normalizeRoutePath(routePath) {
  if (typeof routePath === "string") {
    return routePath;
  }

  if (Array.isArray(routePath)) {
    return routePath.join("|");
  }

  return String(routePath);
}

function getRouteLabel(req) {
  if (req.route?.path) {
    return `${req.baseUrl || ""}${normalizeRoutePath(req.route.path)}`;
  }

  return "unmatched";
}

export function metricsMiddleware(req, res, next) {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const durationInSeconds =
      Number(process.hrtime.bigint() - startTime) / 1_000_000_000;

    const labels = {
      method: req.method,
      route: getRouteLabel(req),
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    httpRequestDurationSeconds.observe(labels, durationInSeconds);
  });

  next();
}

export async function metricsHandler(_, res) {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
}

export function resetMetrics() {
  register.resetMetrics();
}
