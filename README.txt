DUONERA — SUPABASE DATABASE VERSION
====================================

Co je nové:
- krátká registrace se ukládá do tabulky public.duonera_leads
- úplný profil se ukládá do tabulky public.duonera_profiles
- oba formuláře nadále posílají kopii e-mailem přes FormSubmit
- fotografie se zatím posílají jako přílohy e-mailem; Supabase Storage bude další etapa
- výška je nyní povinná
- formuláře při chybě databáze neodejdou a zobrazí uživateli upozornění

Nasazení:
Nahraj celý obsah tohoto ZIPu do kořene GitHub repozitáře duonera-one a potvrď nahrazení souborů.

Test:
1. Odeslat krátkou registraci.
2. V Supabase otevřít Table Editor > duonera_leads a ověřit nový řádek.
3. Dokončit úplný profil.
4. V Supabase otevřít Table Editor > duonera_profiles a ověřit nový řádek.
5. Ověřit, že e-mail stále obsahuje formulář a fotografie.

DŮLEŽITÉ:
Soubor supabase-client.js obsahuje pouze veřejný publishable key. Secret key ani service_role key ve webu nejsou.
