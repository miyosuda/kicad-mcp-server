/**
 * Design rules tools for KiCAD MCP server
 *
 * These tools handle design rule checking and configuration
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
type CommandFunction = (command: string, params: Record<string, unknown>) => Promise<any>;
/**
 * Register design rule tools with the MCP server
 *
 * @param server MCP server instance
 * @param callKicadScript Function to call KiCAD script commands
 */
export declare function registerDesignRuleTools(server: McpServer, callKicadScript: CommandFunction): void;
export {};
