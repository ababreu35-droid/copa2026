# Copa do Mundo 2026 – Tabela ao Vivo

## Opção 1 — Abrir direto no navegador (sem instalação)

Abra o arquivo `copa2026.html` diretamente no Chrome/Safari/Firefox.
Funciona imediatamente com dados atualizados até **19 jun 2026**.

Para ativar atualizações em tempo real:
1. Clique em **"Ativar modo ao vivo"**
2. Cadastre-se grátis em https://www.football-data.org/client/register
3. Cole sua chave de API e clique em **Salvar e ativar**
4. O app passa a atualizar automaticamente a cada 60 segundos

---

## Opção 2 — Projeto React/Vite (requer Node.js)

### Pré-requisitos
- Node.js 18+ → https://nodejs.org

### Instalação
```bash
cd copa
npm install
npm run dev
```

Abra http://localhost:5173 no navegador.

### Configurar API (opcional)
```bash
cp .env.example .env.local
# edite .env.local e cole sua chave:
# VITE_API_KEY=sua_chave_aqui
```

---

## Recursos
- 12 grupos (A–L) com todas as 48 seleções
- Classificação automática (pontos, saldo, gols)
- Indicador ao vivo com contagem regressiva de atualização
- Partidas organizadas por rodada com horários no fuso de Brasília
- Responsivo para celular
