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
export function createJsonResponse(uri: string, data: unknown) : ResourceResponse {
    const content = {
        uri,
        text: JSON.stringify(data),
        mimeType: "application/json"
    };
    return {
        contents: [content]
    };
}
/**
 * Create a text response for a resource
 */
export function createTextResponse(uri: string, text: string) : ResourceResponse {
    const content = {
        uri,
        text,
        mimeType: "text/plain"
    };
    return {
        contents: [content]
    };
}
/**
 * Create a binary response for a resource
 */
export function createBinaryResponse(uri: string, data: string, mimeType: string) : ResourceResponse {
    const content = {
        uri,
        blob: data,
        mimeType
    };
    return {
        contents: [content]
    };
}
/**
 * Create a resource with a URI template
 */
export function createResource(server: McpServer, name: string, uri: string, callback: (uri: URL) => Promise<ResourceResponse>): void {
    const readCallback = async (uri: URL) => {
        const response = await callback(uri);
        return {
            ...response,
            contents: response.contents.map((content: ResourceContentItem | ResourceBinaryContentItem) => ({
                ...content,
                [content.hasOwnProperty('blob') ? 'blob' : 'text']: content.hasOwnProperty('blob') ? content.blob : content.text
            }))
        };
    };
    server.resource(name, uri, readCallback);
}
