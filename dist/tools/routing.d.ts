/**
 * Routing tools for KiCAD MCP server
 *
 * These tools handle trace routing, via placement, and net management
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
type CommandFunction = (command: string, params: Record<string, unknown>) => Promise<any>;
/**
 * Register routing tools with the MCP server
 *
 * @param server MCP server instance
 * @param callKicadScript Function to call KiCAD script commands
 */
export declare function registerRoutingTools(server: McpServer, callKicadScript: CommandFunction): void;
export {};
