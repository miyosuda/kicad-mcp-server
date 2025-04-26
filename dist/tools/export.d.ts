/**
 * Export tools for KiCAD MCP server
 *
 * These tools handle exporting PCB data to various formats
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
type CommandFunction = (command: string, params: Record<string, unknown>) => Promise<any>;
/**
 * Register export tools with the MCP server
 *
 * @param server MCP server instance
 * @param callKicadScript Function to call KiCAD script commands
 */
export declare function registerExportTools(server: McpServer, callKicadScript: CommandFunction): void;
export {};
