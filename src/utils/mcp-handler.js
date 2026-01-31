import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
export async function handleMcpRequest(request, server) {
    try {
        const jsonRpcRequest = (await request.json());
        const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
        let responseData = null;
        clientTransport.onmessage = (message) => {
            responseData = message;
        };
        await server.connect(serverTransport);
        await clientTransport.start();
        await serverTransport.start();
        await clientTransport.send(jsonRpcRequest);
        await new Promise((resolve) => setTimeout(resolve, 10));
        await clientTransport.close();
        await serverTransport.close();
        return Response.json(responseData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    catch (error) {
        console.error('MCP handler error:', error);
        // Return a JSON-RPC error response
        return Response.json({
            jsonrpc: '2.0',
            error: {
                code: -32603,
                message: 'Internal server error',
                data: error instanceof Error ? error.message : String(error),
            },
            id: null,
        }, {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
