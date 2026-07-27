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

V5: Kroky 2-4 a fotografie jsou volitelné. Povinné zůstávají pouze základní identifikační údaje a právní souhlasy.

V6: public contact and FormSubmit recipient changed to info@duonera.cz.

V7:
- německá jazyková verze webu a profilu

V8:
- soukromá administrace na admin.html
- přihlášení administrátora přes Supabase Auth
- přehled tabulek duonera_leads a duonera_profiles
- čtení osobních údajů povoluje RLS pouze účtu info@duonera.cz

Aktivace administrace:
1. V Supabase otevřít Authentication > Users.
2. Vytvořit uživatele info@duonera.cz a nastavit silné heslo.
3. V SQL Editoru spustit soubor supabase-admin-policy.sql.
4. Otevřít https://duonera.cz/admin.html a přihlásit se.

DŮLEŽITÉ:
- heslo administrátora se nikdy nevkládá do souborů webu
- service_role key se nikdy nevkládá do souborů webu
- fotografie jsou zatím dostupné pouze jako přílohy e-mailu
