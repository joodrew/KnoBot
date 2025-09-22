import cron from 'node-cron';
import fetch from 'node-fetch';

async function syncFreshdesk() {
  console.log('🔄 Executando sincronização com Freshdesk...');
  try {
    const res = await fetch('http://localhost:3000/api/sync-freshdesk');
    const data = await res.json();
    console.log('✅ Sincronização concluída:', data);
  } catch (error) {
    console.error('❌ Erro ao sincronizar:', error.message);
  }
}

syncFreshdesk();
cron.schedule('0 * * * *', syncFreshdesk);
