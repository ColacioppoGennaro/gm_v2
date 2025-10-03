# GM v2 – AI Document Assistant

Applicazione web per la gestione intelligente di documenti personali, ricerca AI, calendario evoluto e notifiche push.

---

## 📁 Struttura cartelle

- `/api/` – Endpoint PHP REST (auth, upload, chat, calendario, ecc.)
- `/config/` – File di configurazione e costanti
- `/docs/` – Documentazione tecnica e API di terze parti
- `/lang/` – File multilingua (IT/EN)
- `/public/` – Frontend statico HTML/JS/CSS (index, login, dashboard, assets...)
- `/sql/` – Script SQL per creazione database
- `/vendor/` – Librerie PHP di terze parti (se usate)

---

## 🚀 Avvio rapido

1. Configura i parametri in `config/config.php` (DB, API key, ecc.)
2. Importa `sql/schema.sql` in MariaDB/MySQL.
3. Servi `/public` come root del sito.
4. Implementa le API PHP e collega il frontend.

---

## 🔒 Note

- Tutte le API sono protette da sessione PHP.
- L'integrazione con dockanalyzer.ai avviene SOLO lato backend.
- Predisposizione multilingua (IT/EN).
- Notifiche push e calendario FullCalendar da integrare.

---

## 📚 Documentazione

Vedi `/docs/` per dettagli su integrazioni API di terze parti e specifiche tecniche.
