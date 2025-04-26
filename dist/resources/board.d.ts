/**
 * Board resources for KiCAD MCP server
 *
 * These resources provide information about the PCB board
 * to the LLM, enabling better context-aware assistance.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
type CommandFunction = (command: string, params: Record<string, unknown>) => Promise<any>;
/**
 * Register board resources with the MCP server
 *
 * @param server MCP server instance
 * @param callKicadScript Function to call KiCAD script commands
 */
export declare function registerBoardResources(server: McpServer, callKicadScript: CommandFunction): void;
export {};
