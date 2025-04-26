/**
 * Project management tools for KiCAD MCP server
 *
 * These tools handle KiCAD project operations like creating, opening, and saving projects
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
type CommandFunction = (command: string, params: Record<string, unknown>) => Promise<any>;
/**
 * Register project management tools with the MCP server
 *
 * @param server MCP server instance
 * @param callKicadScript Function to call KiCAD script commands
 */
export declare function registerProjectTools(server: McpServer, callKicadScript: CommandFunction): void;
export {};
