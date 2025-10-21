import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const math = await import("mathjs");

// 创建 MCP 服务器
const server = new Server(
  { name: "CalculatorService", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 注册工具函数
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "add",
      description: "执行浮点数加法运算",
      inputSchema: {
        type: "object",
        properties: {
          a: { type: "number" },
          b: { type: "number" },
        },
        required: ["a", "b"],
      },
    },
    {
      name: "subtract",
      description: "执行浮点数减法运算",
      inputSchema: {
        type: "object",
        properties: {
          a: { type: "number" },
          b: { type: "number" },
        },
        required: ["a", "b"],
      },
    },
    {
      name: "multiply",
      description: "执行浮点数乘法运算",
      inputSchema: {
        type: "object",
        properties: {
          a: { type: "number" },
          b: { type: "number" },
        },
        required: ["a", "b"],
      },
    },
    {
      name: "divide",
      description: "执行浮点数除法运算（除数必须非零）",
      inputSchema: {
        type: "object",
        properties: {
          a: { type: "number" },
          b: { type: "number" },
        },
        required: ["a", "b"],
      },
    },
    {
      name: "power",
      description: "计算幂运算",
      inputSchema: {
        type: "object",
        properties: {
          base: { type: "number" },
          exponent: { type: "number" },
        },
        required: ["base", "exponent"],
      },
    },
    {
      name: "sqrt",
      description: "计算平方根",
      inputSchema: {
        type: "object",
        properties: {
          number: { type: "number" },
        },
        required: ["number"],
      },
    },
    {
      name: "factorial",
      description: "计算整数阶乘",
      inputSchema: {
        type: "object",
        properties: {
          n: { type: "integer" },
        },
        required: ["n"],
      },
    },
  ],
}));

// 执行工具逻辑
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  switch (name) {
    case "add":
      return { content: [{ type: "text", text: String(args.a + args.b) }] };
    case "subtract":
      return { content: [{ type: "text", text: String(args.a - args.b) }] };
    case "multiply":
      return { content: [{ type: "text", text: String(args.a * args.b) }] };
    case "divide":
      if (args.b === 0) throw new Error("除数不能为零");
      return { content: [{ type: "text", text: String(args.a / args.b) }] };
    case "power":
      return { content: [{ type: "text", text: String(Math.pow(args.base, args.exponent)) }] };
    case "sqrt":
      if (args.number < 0) throw new Error("不能对负数开平方");
      return { content: [{ type: "text", text: String(Math.sqrt(args.number)) }] };
    case "factorial":
      if (args.n < 0) throw new Error("负数没有阶乘");
      return { content: [{ type: "text", text: String(math.factorial(args.n)) }] };
    default:
      throw new Error(`未知工具: ${name}`);
  }
});

// 启动 MCP 服务
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("✅ MCP CalculatorService 已启动 (via stdio)");
