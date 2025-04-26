/**
 * Design prompts for KiCAD MCP server
 *
 * These prompts guide the LLM in providing assistance with general PCB design tasks
 * in KiCAD.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register design prompts with the MCP server
 *
 * @param server MCP server instance
 */
export declare function registerDesignPrompts(server: McpServer): void;
