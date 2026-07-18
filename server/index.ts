import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const server = new McpServer({
  name: "zomato-mcp-server",
  version: "1.0.0"
});

// ---- TOOL 1: Get order status ----
server.tool(
  "get_order_status",
  "Get the current status of a specific order using its order ID. Use this when the user asks about their order status.",
  {
    order_id: z.string().describe("The unique order ID")
  },
  async ({ order_id }) => {
    const result = await pool.query(
      "SELECT id, status, total_price FROM orders WHERE id = $1",
      [order_id]
    );
    if (result.rows.length === 0) {
      return { content: [{ type: "text", text: "Order not found" }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(result.rows[0]) }] };
  }
);

// ---- TOOL 2: Get orders by status (combined tool, jaise humne discuss kiya) ----
server.tool(
  "get_orders",
  "Get all orders filtered by status (pending, completed, or cancelled). Use this when user asks to see orders of a specific type.",
  {
    status: z.enum(["pending", "completed", "cancelled"]).describe("The order status to filter by")
  },
  async ({ status }) => {
    const result = await pool.query(
      "SELECT id, status, total_price, created_at FROM orders WHERE status = $1 ORDER BY created_at DESC",
      [status]
    );
    return { content: [{ type: "text", text: JSON.stringify(result.rows) }] };
  }
);

// ---- TOOL 3: Get all restaurants ----
server.tool(
  "get_restaurants",
  "Get a list of all restaurants with their cuisine type and rating. Use this when the user asks to see or search restaurants.",
  {},
  async () => {
    const result = await pool.query("SELECT id, name, cuisine, rating FROM restaurants");
    return { content: [{ type: "text", text: JSON.stringify(result.rows) }] };
  }
);

// ---- Server Start ----
const transport = new StdioServerTransport();
await server.connect(transport);