
export async function GET(request: any) {
    return new Response(JSON.stringify({ message: "Hello, world!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    } as any);
}

export async function POST(request: any) {
    try {
        const textBody = await request.text();
        const body = JSON.parse(textBody);
        return new Response(JSON.stringify({ message: "Data received successfully", data: body }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error parsing JSON:", error);

        return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
}
