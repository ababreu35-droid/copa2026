#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Deploy automático: Copa do Mundo 2026 → Netlify
# Uso: ./deploy-netlify.sh
# ─────────────────────────────────────────────────────────────────

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ZIP_FILE="/tmp/copa-deploy.zip"

echo ""
echo "🏆  Deploy – Copa do Mundo 2026 → Netlify"
echo "──────────────────────────────────────────"
echo ""
echo "Você precisará de um Personal Access Token da Netlify."
echo "→ Como criar (30 segundos):"
echo "  1. Acesse: https://app.netlify.com/user/applications/personal"
echo "  2. Clique 'New access token'"
echo "  3. Dê o nome 'copa-deploy' e clique 'Generate'"
echo "  4. Copie o token"
echo ""

read -rsp "Cole o token Netlify aqui: " NETLIFY_TOKEN
echo ""

if [[ -z "$NETLIFY_TOKEN" ]]; then
  echo "❌  Token vazio. Tente novamente."
  exit 1
fi

echo ""
echo "⏳  Criando site na Netlify..."

# Cria um novo site
SITE_RESP=$(curl -s \
  -X POST \
  -H "Authorization: Bearer $NETLIFY_TOKEN" \
  -H "Content-Type: application/json" \
  https://api.netlify.com/api/v1/sites \
  -d '{"name":"copa-do-mundo-2026"}')

SITE_ID=$(echo "$SITE_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)
SITE_URL=$(echo "$SITE_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('url','') or d.get('ssl_url',''))" 2>/dev/null)

if [[ -z "$SITE_ID" ]]; then
  echo "❌  Não foi possível criar o site. Verifique o token."
  exit 1
fi

echo "✅  Site criado! Fazendo upload..."

# Cria o zip para deploy
cd "$SCRIPT_DIR"
zip -j "$ZIP_FILE" index.html

# Faz o deploy via zip
DEPLOY_RESP=$(curl -s \
  -X POST \
  -H "Authorization: Bearer $NETLIFY_TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary "@$ZIP_FILE" \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys")

DEPLOY_URL=$(echo "$DEPLOY_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('ssl_url','') or d.get('deploy_ssl_url','') or d.get('url',''))" 2>/dev/null)

if [[ -z "$DEPLOY_URL" ]]; then
  DEPLOY_URL="$SITE_URL"
fi

rm -f "$ZIP_FILE"

echo ""
echo "──────────────────────────────────────────────────────"
echo "✅  DEPLOY CONCLUÍDO!"
echo ""
echo "   🔗  Seu app:  $DEPLOY_URL"
echo ""
echo "   Acesse pelo iPhone agora!"
echo "──────────────────────────────────────────────────────"
echo ""
echo "   Dica: adicione à tela inicial do iPhone:"
echo "   Safari → Compartilhar → 'Adicionar à Tela de Início'"
echo ""
