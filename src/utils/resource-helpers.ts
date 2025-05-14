/**
 * Create a JSON response for a resource
 */
export function createJsonResponse(uri: string, data: any) {
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
export function createTextResponse(uri: string, text: string) {
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
export function createBinaryResponse(uri: string, data: any, mimeType: string) {
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
export function createResource(server: any, name: string, uri: string, callback: (uri: string) => Promise<any>) {
    const readCallback = async (uri: string) => {
        const response = await callback(uri);
        return {
            ...response,
            contents: response.contents.map((content: any) => ({
                ...content,
                [content.hasOwnProperty('blob') ? 'blob' : 'text']: content.hasOwnProperty('blob') ? content.blob : content.text
            }))
        };
    };
    server.resource(name, uri, readCallback);
}
