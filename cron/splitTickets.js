import cron from 'node-cron';
import fetch from 'node-fetch';

async function splitTickets() {
  console.log('🔄 Executando split dos tickets no db...');
  try {
    const res = await fetch('http://localhost:3000/api/split-tickets-mongodb');
    const data = await res.json();
    console.log('✅ Split concluído:', data);
  } catch (error) {
    console.error('❌ Erro ao splitar:', error.message);
  }
}

splitTickets();
cron.schedule('0 * * * *', splitTickets);
