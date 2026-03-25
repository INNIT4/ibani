#!/bin/bash
# Enviar URLs a IndexNow después de cada deploy
# Uso: bash scripts/submit-indexnow.sh

KEY="e8eed06c576f819a4f9f8391c59421ad"
KEY_LOCATION="https://www.ibanidigital.com/${KEY}.txt"
HOST="www.ibanidigital.com"

curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{
    \"host\": \"${HOST}\",
    \"key\": \"${KEY}\",
    \"keyLocation\": \"${KEY_LOCATION}\",
    \"urlList\": [
      \"https://www.ibanidigital.com/\",
      \"https://www.ibanidigital.com/hermosillo\",
      \"https://www.ibanidigital.com/obregon\",
      \"https://www.ibanidigital.com/cuanto-cuesta-pagina-web-sonora\"
    ]
  }" && echo "IndexNow: URLs enviadas correctamente"
