# shui-message-board

Jag har byggt både frontend (React/Vite) och backend (Serverless på AWS).
Koden är medvetet enkel och tydlig.        
🔗 Länkar

App (S3):
http://shui-message-board-thapa.s3-website.eu-north-1.amazonaws.com

🎯 Vad kan appen göra?

✍️ Skapa nytt meddelande

✏️ Redigera valfritt meddelande (endast ditt eget när du är inloggad)

🗑️ Ta bort valfritt meddelande (endast ditt eget när du är inloggad)

👀 Se alla meddelanden

🔽 Sortera: Nyast först, Äldst först, Mina meddelanden

🔐 Inloggning/Registrering (enkelt kursläge) – inloggad användare får bara ändra sina poster

Meddelande-modell:

{id, username, text, createdAt}

## Projektkarta (bild)

![Projektstruktur för Shui – Message Board](./Projektstruktur-shui-message-board.jpg)

API-bas (API Gateway):
https://m991wjpm2a.execute-api.eu-north-1.amazonaws.com

GET    {API_BASE}/messages  
POST   {API_BASE}/messages  
PUT    {API_BASE}/messages/{id}  
DELETE {API_BASE}/messages/{id}  
GET    {API_BASE}/users/{username}/messages  

POST   {API_BASE}/auth/register  
POST   {API_BASE}/auth/login


![Projektstruktur för Shui – Message Board](./endPoints.jpg)
