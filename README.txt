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

V9:
- fotografie profilu se ukládají do soukromého Supabase Storage
- fotografie se zobrazují pouze přihlášenému správci v detailu profilu
- správce může přidat fotografie i k existujícímu profilu
- před nasazením V9 spustit soubor supabase-photo-storage.sql

V10:
- krátká registrace trvá přibližně jednu minutu
- telefon se nevyžaduje ani v krátké registraci, ani v úplném profilu
- registrace jasně uvádí, že profil není veřejný a nevzniká platba ani závazek
- odstraněny veřejné formulace o pilotní a nedokončené verzi
- aktualizovány podmínky služby a informace o ochraně soukromí
- texty důvěry byly sjednoceny v češtině, angličtině, němčině, ukrajinštině a ruštině
- při pomalejším ukládání registrace se zobrazí průběžná zpráva; po 20 sekundách se čekání bezpečně ukončí

V11:
- hlavní stránka načítá pouze skutečné, schválené profily s výslovným souhlasem
- odstraněny ukázkové profily, které mohly působit jako skuteční členové
- každý klient získá osobní účet na ucet.html
- přihlášení probíhá bezpečným odkazem zaslaným na e-mail, bez hesla
- klient ve svém účtu vidí vlastní anketu a soukromé fotografie
- klient může označit více lidí, kteří se mu líbí
- vzájemná volba se zobrazí teprve po oboustranném výběru
- administrace ukazuje vzájemné volby pro organizaci schůzky
- administrátor může schválit profil a zveřejnit bezpečnou kopii vybraných fotografií
- administrátor může sestavit prémiovou trojici kandidátů pro konkrétního klienta

Aktivace V11:
1. Reklama musí zůstat pozastavená až do dokončení testu.
2. V Supabase > SQL Editor spustit celý soubor supabase-member-system.sql.
3. V Supabase > Authentication > URL Configuration nastavit:
   Site URL: https://duonera.cz
   Redirect URLs: https://duonera.cz/ucet.html
4. Nahrát aktualizované soubory webu do kořene repozitáře.
5. Provést novou registraci s novým testovacím e-mailem.
6. Otevřít přihlašovací odkaz z e-mailu a ověřit osobní účet.
7. Vyplnit úplný profil a ověřit vlastní anketu a fotografie v ucet.html.
8. V admin.html profil schválit a zveřejnit.
9. Ověřit, že se na hlavní stránce ukáže pouze bezpečná část profilu bez kontaktů.
10. Se dvěma testovacími účty ověřit volbu a vzájemnou shodu.

Aktivace administrace:
1. V Supabase otevřít Authentication > Users.
2. Vytvořit uživatele info@duonera.cz a nastavit silné heslo.
3. V SQL Editoru spustit soubor supabase-admin-policy.sql.
4. Otevřít https://duonera.cz/admin.html a přihlásit se.

DŮLEŽITÉ:
- heslo administrátora se nikdy nevkládá do souborů webu
- service_role key se nikdy nevkládá do souborů webu
- fotografie zůstávají také jako přílohy e-mailu
