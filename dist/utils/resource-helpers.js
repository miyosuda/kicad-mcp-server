/**
 * Create a JSON response for a resource
 */
export function createJsonResponse(uri, data) {
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
export function createTextResponse(uri, text) {
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
export function createBinaryResponse(uri, data, mimeType) {
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
export function createResource(server, name, uri, callback) {
    const readCallback = async (uri) => {
        const response = await callback(uri);
        return {
            ...response,
            contents: response.contents.map((content) => ({
                ...content,
                [content.hasOwnProperty('blob') ? 'blob' : 'text']: content.hasOwnProperty('blob') ? content.blob : content.text
            }))
        };
    };
    server.resource(name, uri, readCallback);
}
//# sourceMappingURL=resource-helpers.js.map