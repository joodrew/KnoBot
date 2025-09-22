import { MongoClient } from "mongodb";

const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN;
const FRESHDESK_API_KEY = process.env.FRESHDESK_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let cachedClient = null;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function syncFreshdeskTickets({ validateStatus = true } = {}) {
    try {
        if (!cachedClient) {
            cachedClient = await MongoClient.connect(MONGODB_URI);
        }

        const db = cachedClient.db(MONGODB_DB_NAME);
        const ticketsCollection = db.collection("tickets");
        const errorCollection = db.collection("importErr");
        const statusCollection = db.collection("status");

        await ticketsCollection.createIndex({ id: 1 }, { unique: true });
        await errorCollection.createIndex({ id: 1 }, { unique: true });
        await statusCollection.createIndex({ id: 1 }, { unique: true });

        const latestResponse = await fetch(`https://${FRESHDESK_DOMAIN}.freshdesk.com/api/v2/tickets?order_by=created_at&order_type=desc&page=1`, {
            headers: {
                Authorization: "Basic " + Buffer.from(`${FRESHDESK_API_KEY}:X`).toString("base64"),
                "Content-Type": "application/json",
            },
        });

        const latestTickets = await latestResponse.json();
        let ticketId = latestTickets[0]?.id || 0;
        let totalInserted = 0;
        let requestCount = 0;

        while (ticketId >= 0 && requestCount < 1000) {
            const ticketUrl = `https://${FRESHDESK_DOMAIN}.freshdesk.com/api/v2/tickets/${ticketId}`;
            const conversationsUrl = `${ticketUrl}/conversations`;

            const headers = {
                Authorization: "Basic " + Buffer.from(`${FRESHDESK_API_KEY}:X`).toString("base64"),
                "Content-Type": "application/json",
            };

            try {
                if (validateStatus) {
                    const localStatus = await statusCollection.findOne({ id: ticketId });
                    if (localStatus?.status === "Encerrado") {
                        ticketId--;
                        continue;
                    }
                }

                const ticketResponse = await fetch(ticketUrl, { headers });
                requestCount++;

                const remaining = parseInt(ticketResponse.headers.get("x-ratelimit-remaining") || "0", 10);
                if (remaining < 10) {
                    console.warn(`Quase atingindo o limite de requisições (${remaining}/1000). Aguardando 60 segundos...`);
                    await sleep(60000);
                }

                if (ticketResponse.status === 429) {
                    const retryAfter = parseInt(ticketResponse.headers.get("Retry-After") || "60", 10);
                    console.warn(`Rate limit atingido. Aguardando ${retryAfter} segundos...`);
                    await sleep(retryAfter * 1000);
                    continue;
                }

                if (!ticketResponse.ok) {
                    const errorMsg = `Erro ${ticketResponse.status}: ${ticketResponse.statusText}`;
                    const exists = await errorCollection.findOne({ id: ticketId });
                    if (!exists) {
                        await errorCollection.insertOne({ id: ticketId, codemsg: errorMsg });
                    }
                    ticketId--;
                    await sleep(500);
                    continue;
                }

                const ticketData = await ticketResponse.json();
                const statusLabel = (ticketData.status === 4 || ticketData.status === 5) ? "Encerrado" : "Aberto-Pendente";

                if (validateStatus) {
                    await statusCollection.updateOne(
                        { id: ticketId },
                        { $set: { id: ticketId, status: statusLabel } },
                        { upsert: true }
                    );

                    if (statusLabel === "Aberto-Pendente") {
                        ticketId--;
                        await sleep(500);
                        continue;
                    }
                }

                // Inserir ticket no MongoDB
                try {
                    await ticketsCollection.insertOne(ticketData);
                    totalInserted++;

                    // Buscar conversas somente após inserção
                    const convResponse = await fetch(conversationsUrl, { headers });
                    requestCount++;
                    const conversations = convResponse.ok ? await convResponse.json() : [];

                    await ticketsCollection.updateOne(
                        { id: ticketId },
                        { $set: { conversations } }
                    );
                } catch (err) {
                    if (err.code !== 11000) {
                        console.error("Erro ao inserir ticket:", err);
                    }
                }


                ticketData.conversations = conversations;

                try {
                    await ticketsCollection.insertOne(ticketData);
                    totalInserted++;
                } catch (err) {
                    if (err.code !== 11000) {
                        console.error("Erro ao inserir ticket:", err);
                    }
                }
            } catch (err) {
                const exists = await errorCollection.findOne({ id: ticketId });
                if (!exists) {
                    await errorCollection.insertOne({ id: ticketId, codemsg: err.message });
                }
            }

            ticketId--;
            await sleep(500);
        }

        console.log(`Processo encerrado. Limite de ${requestCount} requisições atingido ou ticketId chegou a 0.`);

        return {
            success: true,
            inserted: totalInserted,
            message: `Sincronização concluída. ${totalInserted} tickets adicionados.`,
        };

    } catch (error) {
        console.error("Erro na sincronização:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}
