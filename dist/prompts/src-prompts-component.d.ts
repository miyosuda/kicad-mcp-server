/**
 * Component prompts for KiCAD MCP server
 *
 * These prompts guide the LLM in providing assistance with component-related tasks
 * in KiCAD PCB design.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Register component prompts with the MCP server
 *
 * @param server MCP server instance
 */
export declare function registerComponentPrompts(server: McpServer): void;
