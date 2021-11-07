<h1>Go BOOKING - portal za turističku agenciju baziran na mikroservisnoj arhitekturi</h1>

Marija Kastratović sw43/2017

<h3>Opis aplikacije</h3>

GoBooking je portal koji omogućuje korisnicima da pretražuju i pregledaju usluge koje turistička agencija nudi, pretražuju i ocenjuju turističke vodiče zaposlene u agenciji. Takođe korisnici mogu da rezervisu kartu za odabrano putovanje i da ocene putovanje. Uloge koje postoje u sistemu su administrator sistema, turistički vodiči, registrovani korisnici i neautentifikovani korisnici.

<h3>Neautentifikovani korisnik - funkcionalnosti</h3>

Neautentifikovani korisnik ima mogućnost da se prijavi i registruje na sistem. Prilikom registracije, on unosi email, lozinku, ime i prezime. Nakon uspešne registracije, korisnik može da se uloguje i koristi ostale funkcionalnosti sistema. 

<h3>Administrator sistema - funkcionalnosti</h3>

Administrator sistema ima mogućnost registracije novih administratora sistema i turističkih vodiča. Takođe ima mogućnost dodavanja, izmene i brisanja ponuda koje nudi agencija. Administrator takođe ima mogućnost kreiranja izveštaja: turistička destinacija sa najboljim ocenama, najposećenije destinacije, turističke vodiče sa najboljim ocenama i slično.

<h3>Registrovani korisnik - funkcionalnosti</h3>

Registrovani korisnik ima mogućnost da ocenjuje i komentarise turističke destinacije, kao i da obriše svoj komentar. Ima mogućnost da rezerviše putovanje za određenu destinaciju, kao i pregled i poništavanje rezervacija. 

<h2>Arhitektura sistema</h2>

Arhitektura koja bi se koristila za implementaciju sistema bi bila zasnovana na mikroservisima za čiji razvoj bi se koristili jezici Go, Pharo i Python.  

<h3>Korisnički servis</h3>

Flask servis koji omogućava registraciju i prijavu korisnika kao i dodavanje novih administratora i turističkih vodiča.

<h3>Mikroservis za turističke destinacije</h3>

Go servis koji omogućuje dodavanje, izmenu i brisanje konkretnih turističkih destinacija.

<h3>Mikroservis za ocene i komentare</h3>

Go servis za ocenjivanje i komentarisanje destinacija od strane registrovanih korisnika, kao i brisanje komentara.

<h3>Mikroservis za rezervaciju putovanja</h3>

Go servis koji omogućuje registrovanim korisnicima da rezervišu putovanja i otkazuju rezervacije.

<h3>Mikroservis za analitiku</h3>

Pharo servis koji omogućuje prikaz izveštaja navedenih u okviru funkcionalnosti administratora sistema.


