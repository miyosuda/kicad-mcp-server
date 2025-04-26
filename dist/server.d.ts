/**
 * KiCAD MCP Server implementation
 */
/**
 * KiCAD MCP Server class
 */
export declare class KiCADMcpServer {
    private server;
    private pythonProcess;
    private kicadScriptPath;
    private stdioTransport;
    private requestQueue;
    private processingRequest;
    /**
     * Constructor for the KiCAD MCP Server
     * @param kicadScriptPath Path to the Python KiCAD interface script
     * @param logLevel Log level for the server
     */
    constructor(kicadScriptPath: string, logLevel?: 'error' | 'warn' | 'info' | 'debug');
    /**
     * Register all tools, resources, and prompts
     */
    private registerAll;
    /**
     * Start the MCP server and the Python KiCAD interface
     */
    start(): Promise<void>;
    /**
     * Stop the MCP server and clean up resources
     */
    stop(): Promise<void>;
    /**
     * Call the KiCAD scripting interface to execute commands
     *
     * @param command The command to execute
     * @param params The parameters for the command
     * @returns The result of the command execution
     */
    private callKicadScript;
    /**
     * Process the next request in the queue
     */
    private processNextRequest;
}
