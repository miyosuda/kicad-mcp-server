/**
 * Project resources for KiCAD MCP server
 *
 * These resources provide information about the KiCAD project
 * to the LLM, enabling better context-aware assistance.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
type CommandFunction = (command: string, params: Record<string, unknown>) => Promise<any>;
/**
 * Register project resources with the MCP server
 *
 * @param server MCP server instance
 * @param callKicadScript Function to call KiCAD script commands
 */
export declare function registerProjectResources(server: McpServer, callKicadScript: CommandFunction): void;
export {};
