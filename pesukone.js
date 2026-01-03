const http = require("http");

// Washing machine states
const wmStates = [
  "idle",
  "filling water",
  "washing",
  "rinsing",
  "spinning",
  "finished"
];

let wmStatus = 0;
let running = false;
let timer = null;

/**
 * Advances the washing machine to the next state
 */
function advanceState() {
  if (!running) return;

  if (wmStatus < wmStates.length - 1) {
    wmStatus++;
    console.log("State:", wmStates[wmStatus]);
  } else {
    // End of program
    stopMachine();
  }
}

/**
 * Starts the washing machine cycle
 */
function startMachine() {
  if (running) return false;

  running = true;
  wmStatus = 0;
  console.log("Machine started");

  timer = setInterval(advanceState, 5000);
  return true;
}

/**
 * Stops the washing machine cycle
 */
function stopMachine() {
  running = false;
  wmStatus = 0;

  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  console.log("Machine stopped");
}

/**
 * HTTP server
 */
http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/api") {
    res.writeHead(404);
    return res.end();
  }

  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    let data;

    try {
      data = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("Invalid JSON");
    }

    res.writeHead(200, { "Content-Type": "text/plain" });

    if (data.cmd === "status") {
      return res.end(`State: ${wmStates[wmStatus]}`);
    }

    if (data.cmd === "start") {
      if (!startMachine()) {
        return res.end("Error: machine already running");
      }
      return res.end("Washing started");
    }

    if (data.cmd === "abort") {
      stopMachine();
      return res.end("Washing aborted");
    }

    return res.end("Invalid command");
  });
}).listen(3000, () => {
  console.log("Server running on port 3000");
});
