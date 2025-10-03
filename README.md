# shui-message-board

En enkel **meddelandetavla** byggd med **React/Vite** (frontend) och **Serverless på AWS** (backend).  
Koden är medvetet rak och lättläst.

---

## 🔗 Snabblänkar

- **Live-app (S3):**  
  http://shui-message-board-thapa.s3-website.eu-north-1.amazonaws.com
- **API-bas (API Gateway):**  
  https://m991wjpm2a.execute-api.eu-north-1.amazonaws.com

---

## 👤 Demokonton (för snabb test)

| Användarnamn | Lösenord |
| --- | --- |
| Tom Hanks | Tom123 |
| Jesper | Jesper123 |
| Thapa | Thapa123 |
| Brad | Brad123 |

> Tips: logga in med ett konto ovan → kopiera **token** → använd den i `Authorization: Bearer <token>` när du testar skyddade endpoints.

---

## 🎯 Vad kan appen göra?

- ✍️ **Skapa** nytt meddelande  
- ✏️ **Redigera** meddelande *(endast ditt eget när du är inloggad)*
- 🗑️ **Ta bort** meddelande *(endast ditt eget när du är inloggad)*
- 👀 **Se alla** meddelanden
- 🔽 **Sortera:** Nyast först • Äldst först • **Mina meddelanden**
- 🔐 **Login/Registrering** (enkelt kursläge) – inloggad användare får bara ändra sina egna poster

**Meddelande-modell**


{ "id": "string", "username": "string", "text": "string", "createdAt": 1758883332536 }




| Syfte               |  Metod | Path                         | Auth |
| ------------------- | -----: | ---------------------------- | :--: |
| Hämta alla          |    GET | `/messages`                  |   –  |
| Skapa nytt          |   POST | `/messages`                  |   ✅  |
| Uppdatera           |    PUT | `/messages/{id}`             |   ✅  |
| Ta bort             | DELETE | `/messages/{id}`             |   ✅  |
| Mina meddelanden    |    GET | `/users/{username}/messages` |   ✅  |
| Registrera          |   POST | `/auth/register`             |   –  |
| Logga in (få token) |   POST | `/auth/login`                |   –  |


Obs! Skyddade endpoints kräver headern: 
Authorization: Bearer <din-token> 
Fel {id} ger 404. Endast ägaren får uppdatera/ta bort (401/403 annars).


🔗 Direktlänkar (fulla URL:er)

GET – https://m991wjpm2a.execute-api.eu-north-1.amazonaws.com/messages

POST – https://m991wjpm2a.execute-api.eu-north-1.amazonaws.com/messages

PUT – https://m991wjpm2a.execute-api.eu-north-1.amazonaws.com/messages/{id}

DELETE – https://m991wjpm2a.execute-api.eu-north-1.amazonaws.com/messages/{id}

GET – https://m991wjpm2a.execute-api.eu-north-1.amazonaws.com/users/{username}/messages

POST – https://m991wjpm2a.execute-api.eu-north-1.amazonaws.com/auth/register

POST – https://m991wjpm2a.execute-api.eu-north-1.amazonaws.com/auth/login

Utan token svarar skyddade endpoints med 401.

