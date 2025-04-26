import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
interface ResourceContentItem {
    [key: string]: unknown;
    uri: string;
    text: string;
    mimeType?: string;
}
interface ResourceBinaryContentItem {
    [key: string]: unknown;
    uri: string;
    blob: string;
    mimeType?: string;
}
interface ResourceResponse {
    [key: string]: unknown;
    contents: Array<ResourceContentItem | ResourceBinaryContentItem>;
    _meta?: Record<string, unknown>;
}
/**
 * Create a JSON response for a resource
 */
export declare function createJsonResponse(uri: string, data: unknown): ResourceResponse;
/**
 * Create a text response for a resource
 */
export declare function createTextResponse(uri: string, text: string): ResourceResponse;
/**
 * Create a binary response for a resource
 */
export declare function createBinaryResponse(uri: string, data: string, mimeType: string): ResourceResponse;
/**
 * Create a resource with a URI template
 */
export declare function createResource(server: McpServer, name: string, uri: string, callback: (uri: URL) => Promise<ResourceResponse>): void;
export {};
