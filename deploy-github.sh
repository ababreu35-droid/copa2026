#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Deploy automático: Copa do Mundo 2026 → GitHub Pages
# Uso: ./deploy-github.sh
# ─────────────────────────────────────────────────────────────────

set -e
REPO_NAME="copa-2026"
BRANCH="main"
FILE="index.html"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "🏆  Deploy – Copa do Mundo 2026 → GitHub Pages"
echo "───────────────────────────────────────────────"
echo ""
echo "Você vai precisar de um Personal Access Token do GitHub."
echo "→ Como criar (30 segundos):"
echo "  1. Acesse: https://github.com/settings/tokens/new"
echo "  2. Em 'Note': escreva copa-deploy"
echo "  3. Em 'Expiration': escolha 90 days"
echo "  4. Marque apenas o escopo: ✓ repo"
echo "  5. Clique 'Generate token' e copie o token"
echo ""

read -rp "Seu usuário do GitHub: " GITHUB_USER
read -rsp "Cole o token aqui (não aparece ao digitar): " GITHUB_TOKEN
echo ""

if [[ -z "$GITHUB_USER" || -z "$GITHUB_TOKEN" ]]; then
  echo "❌  Usuário ou token vazio. Tente novamente."
  exit 1
fi

echo ""
echo "⏳  Criando repositório '$REPO_NAME'..."

# Tenta criar o repositório (ignora erro se já existir)
CREATE_RESP=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"Copa do Mundo 2026 – tabela ao vivo\",\"auto_init\":true,\"private\":false}")

if [[ "$CREATE_RESP" == "422" ]]; then
  echo "ℹ️   Repositório já existe, continuando..."
elif [[ "$CREATE_RESP" != "201" ]]; then
  echo "❌  Erro ao criar repositório (HTTP $CREATE_RESP). Verifique o token."
  exit 1
else
  echo "✅  Repositório criado!"
  sleep 2
fi

# Obtém o SHA do arquivo se ele já existir (necessário para update)
EXISTING_SHA=$(curl -s \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME/contents/$FILE" \
  2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('sha',''))" 2>/dev/null || echo "")

# Codifica o arquivo em base64
CONTENT=$(base64 -i "$SCRIPT_DIR/$FILE")

if [[ -n "$EXISTING_SHA" ]]; then
  SHA_JSON=",\"sha\":\"$EXISTING_SHA\""
else
  SHA_JSON=""
fi

echo "⏳  Fazendo upload de $FILE..."

UPLOAD_RESP=$(curl -s -o /dev/null -w "%{http_code}" \
  -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME/contents/$FILE" \
  -d "{\"message\":\"deploy: Copa do Mundo 2026\",\"content\":\"$CONTENT\"$SHA_JSON,\"branch\":\"$BRANCH\"}")

if [[ "$UPLOAD_RESP" != "200" && "$UPLOAD_RESP" != "201" ]]; then
  echo "❌  Erro no upload (HTTP $UPLOAD_RESP)."
  exit 1
fi
echo "✅  Arquivo enviado!"

# Ativa GitHub Pages
echo "⏳  Ativando GitHub Pages..."

PAGES_RESP=$(curl -s -o /tmp/pages_resp.json -w "%{http_code}" \
  -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME/pages" \
  -d "{\"source\":{\"branch\":\"$BRANCH\",\"path\":\"/\"}}")

if [[ "$PAGES_RESP" == "409" ]]; then
  echo "ℹ️   GitHub Pages já ativado."
elif [[ "$PAGES_RESP" != "201" ]]; then
  # Tenta atualizar ao invés de criar
  curl -s -X PUT \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME/pages" \
    -d "{\"source\":{\"branch\":\"$BRANCH\",\"path\":\"/\"}}" > /dev/null
fi

URL="https://$GITHUB_USER.github.io/$REPO_NAME/"

echo ""
echo "──────────────────────────────────────────────────────"
echo "✅  DEPLOY CONCLUÍDO!"
echo ""
echo "   🔗  Seu app:  $URL"
echo ""
echo "   Aguarde 1–2 minutos para o GitHub publicar."
echo "   Depois acesse pelo iPhone com o link acima."
echo "──────────────────────────────────────────────────────"
echo ""
echo "   Dica: adicione à tela inicial do iPhone:"
echo "   Safari → Compartilhar → 'Adicionar à Tela de Início'"
echo ""
