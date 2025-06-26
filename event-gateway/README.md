# Event Gateway Backend

## Peran

Event Gateway berfungsi sebagai:

- **Webhook Listener**: Menerima webhook HTTP dari berbagai sumber eksternal
- **Command Processor**: Menerima perintah dari Next.js untuk mengirim pesan ke user tertentu
- **Event Gateway**: Entry point untuk event yang datang via HTTP (bukan via event listener seperti Discord)

## Cara Menjalankan

1. Copy file `.env.example` menjadi `.env` dan isi `DISCORD_TOKEN` dengan token bot Discord Anda.
2. Jalankan perintah berikut di folder `event-gateway`:

```
npm install
npm run dev
```

Event Gateway akan tetap online selama proses berjalan dan dapat menerima webhook serta command.
