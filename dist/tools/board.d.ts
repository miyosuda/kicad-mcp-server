/**
 * Board management tools for KiCAD MCP server
 *
 * These tools handle board setup, layer management, and board properties
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
type CommandFunction = (command: string, params: Record<string, unknown>) => Promise<any>;
/**
 * Register board management tools with the MCP server
 *
 * @param server MCP server instance
 * @param callKicadScript Function to call KiCAD script commands
 */
export declare function registerBoardTools(server: McpServer, callKicadScript: CommandFunction): void;
export {};
