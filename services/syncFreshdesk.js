import { MongoClient } from "mongodb";

const {
  FRESHDESK_DOMAIN,
  MONGODB_URI,
  MONGODB_DB_NAME, //alterar esse nome para algo relaciona ao db tickets
  FRESHDESK_API_KEYS // Espere um string separado por vírgula, ex: "KEY1,KEY2"
} = process.env;

const apiKeys = FRESHDESK_API_KEYS.split(",");
const DOMAIN = FRESHDESK_DOMAIN;
let mongoClient;

/** Pausa por ms */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Busca o maior ticketId existente no Freshdesk */
async function fetchMaxTicketId(apiKey) {
  const res = await fetch(
    `https://${DOMAIN}.freshdesk.com/api/v2/tickets?order_by=created_at&order_type=desc&page=1`,
    {
      headers: {
        Authorization: "Basic " + Buffer.from(`${apiKey}:X`).toString("base64"),
        "Content-Type": "application/json",
      },
    }
  );
  const list = await res.json();
  return list[0]?.id || 0;
}

/** Worker que processa IDs congruentes a seu índice */
async function worker(workerIndex, maxId) {
  const apiKey = apiKeys[workerIndex].trim();
  const headers = {
    Authorization: "Basic " + Buffer.from(`${apiKey}:X`).toString("base64"),
    "Content-Type": "application/json",
  };

  const db = mongoClient.db(MONGODB_DB_NAME);
  const ticketsCol = db.collection("tickets");
  const statusCol = db.collection("status");
  const errorsCol = db.collection("importErr");

  // Garantir índices únicos
  await ticketsCol.createIndex({ id: 1 }, { unique: true });
  await statusCol.createIndex({ id: 1 }, { unique: true });
  await errorsCol.createIndex({ id: 1 }, { unique: true });

  for (let ticketId = maxId - workerIndex; ticketId > 0; ticketId -= apiKeys.length) {
    // 1) Pular ticket já encerrado
    const st = await statusCol.findOne({ id: ticketId });
    if (st?.status === "Encerrado") continue;

    // 2) Pular se já temos conversas
    const existing = await ticketsCol.findOne(
      { id: ticketId },
      { projection: { conversations: 1 } }
    );
    if (existing?.conversations?.length > 0) continue;

    // 3) Buscar ticket
    let ticketRes;
    try {
      ticketRes = await fetch(
        `https://${DOMAIN}.freshdesk.com/api/v2/tickets/${ticketId}`,
        { headers }
      );
    } catch (err) {
      await errorsCol.updateOne(
        { id: ticketId },
        { $setOnInsert: { id: ticketId, error: err.message } },
        { upsert: true }
      );
      continue;
    }

    // 4) Rate limit
    if (ticketRes.status === 429) {
      const retry = parseInt(ticketRes.headers.get("Retry-After") || "60", 10);
      await sleep(retry * 1000);
      ticketId += apiKeys.length; // repetir este ID
      continue;
    }

    if (!ticketRes.ok) {
      await errorsCol.updateOne(
        { id: ticketId },
        {
          $setOnInsert: {
            id: ticketId,
            error: `HTTP ${ticketRes.status}: ${ticketRes.statusText}`,
          },
        },
        { upsert: true }
      );
      continue;
    }

    const ticketData = await ticketRes.json();
    const statusLabel =
      ticketData.status === 4 || ticketData.status === 5
        ? "Encerrado"
        : "Aberto-Pendente";

    // 5) Marcar status e pular abertos pendentes
    await statusCol.updateOne(
      { id: ticketId },
      { $set: { id: ticketId, status: statusLabel } },
      { upsert: true }
    );
    if (statusLabel !== "Encerrado") continue;

    // 6) Inserir ticket (apenas 1x)
    const insertResult = await ticketsCol.updateOne(
      { id: ticketId },
      { $setOnInsert: ticketData },
      { upsert: true }
    );

    // 7) Se inserido agora OU falta conversas, buscar e salvar
    if (insertResult.upsertedCount === 1 || !existing) {
      let convList = [];
      try {
        const convRes = await fetch(
          `https://${DOMAIN}.freshdesk.com/api/v2/tickets/${ticketId}/conversations`,
          { headers }
        );
        if (convRes.ok) convList = await convRes.json();
      } catch (e) {
        console.warn(`Erro conversas #${ticketId}:`, e.message);
      }

      await ticketsCol.updateOne(
        { id: ticketId },
        { $set: { conversations: convList } }
      );
    }

    // 8) Intervalo mínimo entre requisições
    await sleep(500);
  }

  console.log(`Worker ${workerIndex} finalizado.`);
}

/** Função principal: conecta ao Mongo, busca maxId e dispara workers */
export async function syncFreshdeskTickets() {
  try {
    if (!mongoClient) {
      mongoClient = await MongoClient.connect(MONGODB_URI);
    }

    // Determinar maior ID apenas com a primeira chave
    const maxId = await fetchMaxTicketId(apiKeys[0]);

    // Dispara todos os workers em paralelo
    await Promise.all(
      apiKeys.map((_, idx) => worker(idx, maxId))
    );

    return { success: true, message: "Sincronização concluída em paralelo." };
  } catch (error) {
    console.error("Erro na sincronização:", error);
    return { success: false, error: error.message };
  }
}