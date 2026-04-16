import React, { useEffect, useMemo, useState } from "react";

const vocabulary = {
  Familie: [
    { de: "der Bruder", fr: "un frère" },
    { de: "die Schwester", fr: "une sœur" },
    { de: "die Eltern", fr: "les parents" },
    { de: "der Vater", fr: "le père" },
    { de: "die Mutter", fr: "la mère" },
    { de: "der Großvater", fr: "un grand-père" },
    { de: "die Großmutter", fr: "une grand-mère" },
    { de: "der Onkel", fr: "un oncle" },
    { de: "die Tante", fr: "une tante" },
    { de: "der Cousin", fr: "un cousin" },
    { de: "die Cousine", fr: "une cousine" },
    { de: "der Neffe", fr: "un neveu" },
    { de: "die Nichte", fr: "une nièce" },
    { de: "der Freund", fr: "un ami" },
    { de: "die Freundin", fr: "une amie" },
    { de: "der Kumpel", fr: "un copain" },
    { de: "die Kumpelin", fr: "une copine" },
    { de: "der Klassenkamerad", fr: "un camarade de classe" },
    { de: "der Austauschpartner", fr: "un correspondant" },
    { de: "die Austauschpartnerin", fr: "une correspondante" },
  ],
  "Charakter & Aussehen": [
    { de: "sympathisch", fr: "sympathique" },
    { de: "unsympathisch", fr: "antipathique" },
    { de: "nett", fr: "gentil / gentille" },
    { de: "gemein", fr: "méchant / méchante" },
    { de: "dynamisch", fr: "dynamique" },
    { de: "ruhig", fr: "calme" },
    { de: "ernst", fr: "sérieux / sérieuse" },
    { de: "lustig", fr: "drôle / rigolo / rigolote" },
    { de: "komisch", fr: "comique" },
    { de: "traurig", fr: "triste" },
    { de: "großzügig", fr: "généreux / généreuse" },
    { de: "gesprächig", fr: "bavard / bavarde" },
    { de: "schüchtern", fr: "timide" },
    { de: "intelligent", fr: "intelligent / intelligente" },
    { de: "dumm", fr: "stupide" },
    { de: "braunhaarig", fr: "brun / brune" },
    { de: "blond", fr: "blond / blonde" },
    { de: "rothaarig", fr: "roux / rousse" },
    { de: "kastanienbraun", fr: "châtain" },
    { de: "klein", fr: "petit / petite" },
    { de: "groß", fr: "grand / grande" },
    { de: "mager", fr: "maigre" },
    { de: "schlank", fr: "mince" },
    { de: "dick", fr: "gros / grosse" },
    { de: "muskulös", fr: "musclé / musclée" },
    { de: "berühmt", fr: "célèbre" },
    { de: "genial", fr: "génial" },
    { de: "modisch", fr: "à la mode" },
    { de: "lange Haare", fr: "les cheveux longs" },
    { de: "grüne Augen", fr: "les yeux verts" },
    { de: "schön", fr: "beau / belle" },
    { de: "witzig", fr: "marrant / amusant" },
  ],
  Körper: [
    { de: "der Kopf", fr: "la tête" },
    { de: "das Auge", fr: "un œil" },
    { de: "die Augen", fr: "des yeux" },
    { de: "die Nase", fr: "un nez" },
    { de: "der Mund", fr: "une bouche" },
    { de: "die Haare", fr: "les cheveux" },
    { de: "das Ohr", fr: "une oreille" },
    { de: "der Arm", fr: "un bras" },
    { de: "die Hand", fr: "une main" },
    { de: "das Bein", fr: "une jambe" },
    { de: "der Fuß", fr: "un pied" },
    { de: "Halsschmerzen haben", fr: "avoir mal à la gorge" },
    { de: "Bauchschmerzen haben", fr: "avoir mal au ventre" },
    { de: "Fieber haben", fr: "avoir de la fièvre" },
    { de: "krank sein", fr: "être malade" },
    { de: "müde sein", fr: "être fatigué / fatiguée" },
    { de: "fit sein", fr: "être en pleine forme" },
  ],
  Kleidung: [
    { de: "der Rock", fr: "une jupe" },
    { de: "das Kleid", fr: "une robe" },
    { de: "die Hose", fr: "un pantalon" },
    { de: "die Jeans", fr: "un jean" },
    { de: "die Shorts", fr: "un short" },
    { de: "das T-Shirt", fr: "un tee-shirt" },
    { de: "das Polohemd", fr: "un polo" },
    { de: "das Hemd", fr: "une chemise" },
    { de: "die Bluse", fr: "un chemisier" },
    { de: "die Jacke", fr: "un blouson" },
    { de: "das Sakko / die Jacke", fr: "une veste" },
    { de: "die Schuhe", fr: "des chaussures" },
    { de: "ein Paar Schuhe", fr: "une paire de chaussures" },
    { de: "die Sneakers", fr: "des baskets" },
    { de: "die Turnschuhe", fr: "des tennis" },
    { de: "die Handschuhe", fr: "des gants" },
    { de: "die Mütze", fr: "un bonnet" },
    { de: "der Schal", fr: "une écharpe" },
    { de: "die Brille", fr: "des lunettes" },
    { de: "der Hut", fr: "un chapeau" },
    { de: "der Regenschirm", fr: "un parapluie" },
    { de: "die Kappe", fr: "une casquette" },
    { de: "die Uhr", fr: "une montre" },
    { de: "der Schmuck", fr: "un bijou" },
    { de: "der Gürtel", fr: "une ceinture" },
    { de: "der Badeanzug / die Badehose", fr: "un maillot de bain" },
    { de: "das Badetuch", fr: "une serviette de bain" },
    { de: "die Badekappe", fr: "un bonnet de bain" },
    { de: "die Sporttasche", fr: "un sac de sport" },
    { de: "der Rucksack", fr: "un sac à dos" },
    { de: "die Handtasche", fr: "un sac à main" },
    { de: "die Größe", fr: "la taille" },
    { de: "die Schuhgröße", fr: "la pointure" },
    { de: "ein Kleidungsstück anprobieren", fr: "essayer un vêtement" },
    { de: "ein Kleidungsstück anziehen", fr: "mettre un vêtement" },
    { de: "ein Kleidungsstück tragen", fr: "porter un vêtement" },
    { de: "ein Kleidungsstück ausziehen", fr: "enlever un vêtement" },
    { de: "kariert", fr: "à carreaux" },
    { de: "weiß", fr: "blanc / blanche" },
    { de: "rot", fr: "rouge" },
    { de: "mit Blumen", fr: "avec des fleurs" },
  ],
  Alltagsobjekte: [
    { de: "die Kamera", fr: "un appareil photo" },
    { de: "das Telefon", fr: "un téléphone" },
    { de: "das Smartphone", fr: "un smartphone" },
    { de: "das Radio", fr: "une radio" },
    { de: "der Plan / Stadtplan", fr: "un plan" },
    { de: "das Paket", fr: "un colis" },
    { de: "der Umschlag", fr: "une enveloppe" },
    { de: "die Briefmarke", fr: "un timbre" },
    { de: "die Postkarte", fr: "une carte postale" },
    { de: "die Bankkarte", fr: "une carte bancaire" },
    { de: "der Computer", fr: "un ordinateur" },
    { de: "die Tastatur", fr: "un clavier" },
    { de: "die Maus", fr: "une souris" },
    { de: "der Bildschirm", fr: "un écran" },
    { de: "der USB-Stick", fr: "une clé USB" },
    { de: "eine E-Mail senden", fr: "envoyer un mail" },
    { de: "eine E-Mail erhalten", fr: "recevoir un mail" },
    { de: "eine Datei herunterladen", fr: "télécharger un fichier" },
    { de: "Fotos herunterladen", fr: "télécharger des photos" },
    { de: "Musik herunterladen", fr: "télécharger de la musique" },
    { de: "auf ein Symbol klicken", fr: "cliquer sur une icône" },
    { de: "schwer", fr: "lourd / lourde" },
    { de: "leicht", fr: "léger / légère" },
    { de: "rund", fr: "rond / ronde" },
    { de: "quadratisch", fr: "carré / carrée" },
    { de: "aus Glas", fr: "en verre" },
    { de: "aus Holz", fr: "en bois" },
    { de: "aus Plastik", fr: "en plastique" },
    { de: "aus Eisen", fr: "en fer" },
    { de: "praktisch", fr: "pratique" },
  ],
  Berufe: [
    { de: "der Animateur", fr: "un animateur" },
    { de: "die Animateurin", fr: "une animatrice" },
    { de: "der Skilehrer", fr: "un moniteur de ski" },
    { de: "die Skilehrerin", fr: "une monitrice" },
    { de: "die Aufsichtsperson", fr: "un surveillant / une surveillante" },
    { de: "der Sportler", fr: "un sportif" },
    { de: "die Sportlerin", fr: "une sportive" },
    { de: "der Künstler", fr: "un artiste" },
    { de: "der Sänger", fr: "un chanteur" },
    { de: "die Sängerin", fr: "une chanteuse" },
    { de: "der Schauspieler", fr: "un acteur" },
    { de: "die Schauspielerin", fr: "une actrice" },
    { de: "der Regisseur", fr: "un réalisateur" },
    { de: "die Regisseurin", fr: "une réalisatrice" },
    { de: "der Kellner", fr: "un garçon de café" },
    { de: "die Bedienung", fr: "une serveuse" },
    { de: "der Angestellte", fr: "un employé" },
    { de: "die Angestellte", fr: "une employée" },
    { de: "der Feuerwehrmann", fr: "un pompier" },
    { de: "der Polizist", fr: "un policier" },
    { de: "die Polizistin", fr: "une policière" },
    { de: "der Anwalt", fr: "un avocat" },
    { de: "die Anwältin", fr: "une avocate" },
    { de: "der Briefträger", fr: "un facteur" },
    { de: "die Briefträgerin", fr: "une factrice" },
    { de: "der Dieb", fr: "un voleur" },
    { de: "die Diebin", fr: "une voleuse" },
  ],
  Wohnen: [
    { de: "das Haus", fr: "une maison" },
    { de: "die Wohnung", fr: "un appartement" },
    { de: "das Wohnzimmer", fr: "un salon" },
    { de: "das Esszimmer", fr: "une salle à manger" },
    { de: "das Schlafzimmer", fr: "une chambre" },
    { de: "die Küche", fr: "une cuisine" },
    { de: "das Badezimmer", fr: "une salle de bains" },
    { de: "die Toilette", fr: "des toilettes / des w.-c." },
    { de: "der Flur", fr: "un couloir" },
    { de: "die Tür", fr: "une porte" },
    { de: "das Fenster", fr: "une fenêtre" },
    { de: "der Balkon", fr: "un balcon" },
    { de: "die Terrasse", fr: "une terrasse" },
    { de: "der Garten", fr: "un jardin" },
    { de: "der Kamin", fr: "une cheminée" },
    { de: "die Garage", fr: "un garage" },
    { de: "der Tisch", fr: "une table" },
    { de: "das Bett", fr: "un lit" },
    { de: "der Schreibtisch", fr: "un bureau" },
    { de: "der Schrank", fr: "une armoire" },
    { de: "der Stuhl", fr: "une chaise" },
    { de: "der Sessel", fr: "un fauteuil" },
    { de: "das Regal", fr: "une étagère" },
    { de: "die Pflanze", fr: "une plante" },
    { de: "die Lampe", fr: "une lampe" },
    { de: "mieten", fr: "louer" },
    { de: "Eigentümer sein", fr: "être propriétaire" },
    { de: "wohnen", fr: "habiter" },
  ],
  Transport: [
    { de: "das Auto", fr: "une voiture" },
    { de: "das Fahrrad", fr: "un vélo" },
    { de: "der Bus", fr: "un bus" },
    { de: "die Metro", fr: "le métro" },
    { de: "die Straßenbahn", fr: "le tram / le tramway" },
    { de: "das Taxi", fr: "un taxi" },
    { de: "der Fahrer", fr: "un chauffeur" },
    { de: "das Skateboard", fr: "un skateboard" },
    { de: "die Rollschuhe", fr: "des rollers" },
    { de: "der Fahrradweg", fr: "une piste cyclable" },
    { de: "die Fahrradstation", fr: "une station de vélos en libre-service" },
    { de: "die Bushaltestelle", fr: "un arrêt" },
    { de: "der Fahrgast", fr: "un passager" },
    { de: "die Station", fr: "une station" },
    { de: "die Linie", fr: "une ligne" },
    { de: "die Route", fr: "un itinéraire" },
    { de: "die Fahrkarte", fr: "un ticket" },
    { de: "der Fahrkartenautomat", fr: "un distributeur de tickets" },
    { de: "das Abo", fr: "un abonnement" },
    { de: "der Zug", fr: "le train" },
    { de: "der Bahnhof", fr: "une gare" },
    { de: "das Gleis", fr: "une voie" },
    { de: "der Bahnsteig", fr: "un quai" },
    { de: "der Platz", fr: "une place" },
    { de: "der Kontrolleur", fr: "un contrôleur" },
    { de: "das Ticket / der Fahrschein", fr: "un billet / un titre de transport" },
    { de: "die Zugtür", fr: "une porte du train" },
    { de: "die Ankunft", fr: "l’arrivée" },
    { de: "die Abfahrt", fr: "le départ" },
    { de: "die Verspätung", fr: "un retard" },
    { de: "die Verbindung", fr: "une correspondance" },
    { de: "die Endstation", fr: "le terminus" },
    { de: "der Ausgang", fr: "une sortie" },
    { de: "die Treppe", fr: "un escalier" },
    { de: "die Reservierung", fr: "une réservation" },
    { de: "der Flughafen", fr: "un aéroport" },
    { de: "der Flug", fr: "un vol" },
    { de: "das Reiseziel", fr: "une destination" },
    { de: "das Gate", fr: "une porte d’embarquement" },
    { de: "das Terminal", fr: "un terminal" },
    { de: "das Gepäck", fr: "un bagage" },
    { de: "der Steward", fr: "un steward" },
    { de: "die Flugbegleiterin", fr: "une hôtesse de l’air" },
    { de: "sich fortbewegen", fr: "se déplacer" },
    { de: "reisen", fr: "voyager" },
    { de: "abreisen", fr: "partir" },
    { de: "ankommen", fr: "arriver" },
    { de: "reservieren", fr: "réserver" },
    { de: "ein Ticket entwerten", fr: "composter un billet" },
    { de: "direkt", fr: "direct / directe" },
    { de: "umsteigen", fr: "changer" },
    { de: "Der Bus fährt oft.", fr: "Le bus passe souvent." },
  ],
  "Öffentliche Orte & Freizeit": [
    { de: "das Restaurant", fr: "un restaurant" },
    { de: "das Café", fr: "un café" },
    { de: "die Cafeteria", fr: "une cafétéria" },
    { de: "das Hotel", fr: "un hôtel" },
    { de: "die Post", fr: "la poste" },
    { de: "die Bank", fr: "une banque" },
    { de: "der Parkplatz", fr: "un parking" },
    { de: "der öffentliche Garten", fr: "un jardin public" },
    { de: "die Straße", fr: "une rue" },
    { de: "die Sackgasse", fr: "une impasse" },
    { de: "der Boulevard", fr: "un boulevard" },
    { de: "die Allee", fr: "une avenue" },
    { de: "der Platz", fr: "une place" },
    { de: "das Gebäude", fr: "un bâtiment" },
    { de: "das Wohnhaus", fr: "un immeuble" },
    { de: "das Erdgeschoss", fr: "le rez-de-chaussée" },
    { de: "der erste Stock", fr: "le premier étage" },
    { de: "der letzte Stock", fr: "le dernier étage" },
    { de: "lesen", fr: "la lecture / lire" },
    { de: "schreiben", fr: "l’écriture / écrire" },
    { de: "ein Buch lesen", fr: "lire un livre" },
    { de: "einen Comic lesen", fr: "lire une BD" },
    { de: "eine Zeitschrift lesen", fr: "lire un magazine" },
    { de: "einen Blog schreiben", fr: "écrire un blog" },
    { de: "ein Tagebuch schreiben", fr: "écrire un journal intime" },
    { de: "ein Buch ausleihen", fr: "emprunter un livre" },
    { de: "ein Buch zurückgeben", fr: "rendre un livre" },
    { de: "das Buch", fr: "un livre" },
    { de: "der Comic", fr: "une bande dessinée" },
    { de: "der Roman", fr: "un roman" },
    { de: "das Kino", fr: "un cinéma" },
    { de: "der Film", fr: "un film" },
    { de: "die Serie", fr: "une série" },
    { de: "die Fernsehnachrichten", fr: "un journal télévisé" },
    { de: "das Programm", fr: "un programme" },
    { de: "die Realityshow", fr: "une émission de téléréalité" },
    { de: "die TV-Show", fr: "un jeu télévisé" },
    { de: "der Kandidat", fr: "un candidat" },
    { de: "der Sketch", fr: "un sketch" },
    { de: "der Komiker", fr: "un comique" },
    { de: "fernsehen", fr: "regarder la télévision" },
    { de: "ins Kino gehen", fr: "aller au cinéma" },
    { de: "Science-Fiction", fr: "une science-fiction" },
    { de: "die Komödie", fr: "une comédie" },
    { de: "die Tragödie", fr: "une tragédie" },
    { de: "der Thriller", fr: "un thriller" },
    { de: "der Krimi", fr: "un policier" },
    { de: "das Drama", fr: "un drame" },
    { de: "der Liebesfilm", fr: "un film romantique" },
    { de: "der historische Film", fr: "un film historique" },
    { de: "der Zeichentrickfilm", fr: "un dessin animé" },
    { de: "der Animationsfilm", fr: "un film d’animation" },
    { de: "die Musik", fr: "la musique" },
    { de: "Musik hören", fr: "écouter de la musique" },
    { de: "tanzen", fr: "danser" },
    { de: "der Tanz", fr: "la danse" },
    { de: "singen", fr: "chanter" },
    { de: "der Gesang", fr: "le chant" },
    { de: "ein Instrument spielen", fr: "jouer d’un instrument de musique" },
    { de: "die Geige", fr: "un violon" },
    { de: "die Flöte", fr: "une flûte" },
    { de: "die Gitarre", fr: "une guitare" },
    { de: "das Klavier", fr: "un piano" },
    { de: "das Schlagzeug", fr: "une batterie" },
    { de: "die Musikschule", fr: "une école de musique" },
    { de: "im Internet surfen", fr: "surfer sur Internet" },
    { de: "online spielen", fr: "jouer en ligne" },
    { de: "mit der Familie spielen", fr: "jouer en famille" },
    { de: "mit Freunden spielen", fr: "jouer entre amis" },
    { de: "das Videospiel", fr: "les jeux vidéo" },
    { de: "das Gesellschaftsspiel", fr: "les jeux de société" },
    { de: "sich interessieren für", fr: "s’intéresser à" },
    { de: "bewundern", fr: "admirer" },
    { de: "teilnehmen an", fr: "participer à" },
    { de: "ausgehen", fr: "sortir" },
    { de: "ins Theater gehen", fr: "aller au théâtre" },
    { de: "auf ein Konzert gehen", fr: "aller à un concert" },
    { de: "der Freizeitpark", fr: "un parc d’attractions" },
    { de: "der Veranstaltungssaal", fr: "une salle de spectacle" },
    { de: "das Theaterstück", fr: "une pièce" },
    { de: "das Auditorium", fr: "un auditorium" },
    { de: "die Oper", fr: "un opéra" },
    { de: "der Kulturort", fr: "un lieu culturel" },
    { de: "das Museum", fr: "un musée" },
    { de: "die Führung", fr: "une visite guidée" },
    { de: "der Audioguide", fr: "un audioguide" },
    { de: "der Empfang", fr: "l’accueil" },
    { de: "das Ticket", fr: "un billet" },
    { de: "die Galerie", fr: "une galerie" },
    { de: "das historische Denkmal", fr: "un monument historique" },
    { de: "die Statue", fr: "une statue" },
    { de: "die Skulptur", fr: "une sculpture" },
    { de: "das Gemälde", fr: "un tableau" },
  ],
  Sport: [
    { de: "Sport treiben", fr: "faire du sport" },
    { de: "sportliche Aktivität", fr: "une activité sportive" },
    { de: "Gymnastik", fr: "la gymnastique" },
    { de: "Schwimmen", fr: "la natation" },
    { de: "Badminton", fr: "le badminton" },
    { de: "Basketball", fr: "le basket-ball" },
    { de: "Fußball", fr: "le football" },
    { de: "Karate", fr: "le karaté" },
    { de: "Tennis", fr: "le tennis" },
    { de: "Mountainbike", fr: "le vélo tous terrains" },
    { de: "Volleyball", fr: "le volley-ball" },
    { de: "Wasserball", fr: "le water-polo" },
    { de: "Klettern", fr: "l’escalade" },
    { de: "Fechten", fr: "l’escrime" },
    { de: "das Fußballspiel", fr: "un match de foot" },
    { de: "das Volleyballspiel", fr: "un match de volley-ball" },
    { de: "das Basketballspiel", fr: "un match de basket" },
    { de: "die Mannschaft", fr: "une équipe" },
    { de: "der Wettkampf", fr: "une compétition" },
    { de: "die Meisterschaft", fr: "un championnat" },
    { de: "die Olympischen Spiele", fr: "les Jeux Olympiques" },
    { de: "der Fußballplatz", fr: "un terrain de foot" },
    { de: "der Basketballplatz", fr: "un terrain de basket-ball" },
    { de: "das Schwimmbad", fr: "une piscine" },
    { de: "der Fitnessraum", fr: "une salle de sport" },
    { de: "das Stadion", fr: "un stade" },
    { de: "die Turnhalle", fr: "un gymnase" },
  ],
  Einkaufen: [
    { de: "das Geschäft", fr: "un magasin" },
    { de: "die Boutique", fr: "une boutique" },
    { de: "das Einkaufszentrum", fr: "un centre commercial" },
    { de: "die Konditorei", fr: "une pâtisserie" },
    { de: "die Bäckerei", fr: "une boulangerie" },
    { de: "die Apotheke", fr: "une pharmacie" },
    { de: "die Metzgerei", fr: "une boucherie" },
    { de: "die Wurstwarenhandlung", fr: "une charcuterie" },
    { de: "die Fischhandlung", fr: "une poissonnerie" },
    { de: "der Lebensmittelladen", fr: "une épicerie" },
    { de: "der Waschsalon", fr: "une laverie" },
    { de: "die Buchhandlung", fr: "une librairie" },
    { de: "der Kunde", fr: "un client" },
    { de: "der Verkäufer", fr: "un vendeur" },
    { de: "die Umkleidekabine", fr: "une cabine d’essayage" },
    { de: "das Regal / die Abteilung", fr: "un rayon" },
    { de: "die Kasse", fr: "une caisse" },
    { de: "das Etikett", fr: "une étiquette" },
    { de: "der Preis", fr: "un prix" },
    { de: "der Rabatt", fr: "une réduction" },
    { de: "das Sonderangebot", fr: "une offre exceptionnelle" },
    { de: "der Gutschein", fr: "un bon d’achat" },
    { de: "kaufen", fr: "acheter" },
    { de: "verkaufen", fr: "vendre" },
    { de: "umtauschen", fr: "échanger" },
    { de: "erstatten", fr: "rembourser" },
    { de: "mit Karte zahlen", fr: "payer par carte" },
    { de: "bar zahlen", fr: "payer en espèces" },
    { de: "Wechselgeld zurückgeben", fr: "rendre la monnaie" },
    { de: "Wie viel kostet das?", fr: "Combien ça coûte ?" },
    { de: "Gibt es das auch in Weiß?", fr: "Ce polo existe aussi en blanc ?" },
    { de: "Haben Sie ein günstigeres Modell?", fr: "Vous avez un modèle moins cher ?" },
    { de: "Kann ich diesen Artikel umtauschen?", fr: "Je peux échanger cet article ?" },
  ],
  Schule: [
    { de: "die Schule", fr: "un collège / un lycée" },
    { de: "das Klassenzimmer", fr: "une salle de classe" },
    { de: "der Unterricht", fr: "un cours" },
    { de: "die Unterrichtsstunde", fr: "une heure de cours" },
    { de: "der Schulhof", fr: "une cour de récréation" },
    { de: "die Kantine", fr: "une cantine" },
    { de: "das Internat", fr: "un internat" },
    { de: "die Bibliothek", fr: "une bibliothèque" },
    { de: "das CDI", fr: "un CDI" },
    { de: "der Lehrer", fr: "un professeur" },
    { de: "der Schüler", fr: "un élève" },
    { de: "der Klassensprecher", fr: "un délégué de classe" },
    { de: "die Schulfächer", fr: "les matières scolaires" },
    { de: "Mathematik", fr: "les mathématiques" },
    { de: "Geschichte", fr: "l’histoire" },
    { de: "Geografie", fr: "la géographie" },
    { de: "Literatur", fr: "la littérature" },
    { de: "Fremdsprache", fr: "la langue vivante" },
    { de: "Naturwissenschaften", fr: "la SVT" },
    { de: "Biologie", fr: "la biologie" },
    { de: "Physik-Chemie", fr: "la physique-chimie" },
    { de: "die Hausaufgaben", fr: "les devoirs" },
    { de: "die Übung", fr: "un exercice" },
    { de: "das Referat", fr: "un exposé" },
    { de: "die Prüfung", fr: "un examen" },
    { de: "der Test", fr: "un test" },
    { de: "der Schulanfang", fr: "la rentrée des classes" },
    { de: "das Schuljahresende", fr: "la fin de l’année scolaire" },
    { de: "die Tafel", fr: "un tableau" },
    { de: "die Kreide", fr: "une craie" },
    { de: "das Heft", fr: "un cahier" },
    { de: "der Filzstift", fr: "un feutre" },
    { de: "der Stift", fr: "un stylo" },
    { de: "der Bleistift", fr: "un crayon à papier" },
    { de: "das Mäppchen", fr: "une trousse" },
    { de: "der Radiergummi", fr: "une gomme" },
    { de: "die Schere", fr: "des ciseaux" },
    { de: "lernen", fr: "étudier" },
    { de: "wiederholen", fr: "réviser" },
    { de: "auswendig lernen", fr: "apprendre par cœur" },
    { de: "abfragen", fr: "interroger" },
    { de: "Französisch lernen", fr: "étudier le français" },
  ],
  Essen: [
    { de: "das Frühstück", fr: "le petit-déjeuner" },
    { de: "das Mittagessen", fr: "le déjeuner" },
    { de: "das Abendessen", fr: "le dîner" },
    { de: "das Picknick", fr: "un pique-nique" },
    { de: "die Vorspeise", fr: "une entrée" },
    { de: "das Hauptgericht", fr: "un plat principal" },
    { de: "das Dessert", fr: "un dessert" },
    { de: "das Fleisch", fr: "la viande" },
    { de: "die Wurstwaren", fr: "la charcuterie" },
    { de: "der Fisch", fr: "le poisson" },
    { de: "das Gemüse", fr: "un légume" },
    { de: "das Obst", fr: "un fruit" },
    { de: "das Ei", fr: "un œuf" },
    { de: "das Brot", fr: "le pain" },
    { de: "das Müsli / Getreide", fr: "des céréales" },
    { de: "die Nudeln", fr: "des pâtes" },
    { de: "der Reis", fr: "le riz" },
    { de: "die Suppe", fr: "une soupe" },
    { de: "der Salat", fr: "une salade" },
    { de: "der Käse", fr: "un fromage" },
    { de: "das Eis", fr: "une glace" },
    { de: "das Getränk", fr: "une boisson" },
    { de: "der Tee", fr: "un thé" },
    { de: "der Kaffee", fr: "un café" },
    { de: "die Limonade", fr: "un soda" },
    { de: "das kohlensäurehaltige Getränk", fr: "une boisson gazeuse" },
    { de: "der Fruchtsaft", fr: "un jus de fruit" },
    { de: "süß", fr: "sucré" },
    { de: "salzig", fr: "salé" },
    { de: "scharf / würzig", fr: "épicé" },
    { de: "lecker", fr: "délicieux" },
    { de: "eklig", fr: "dégoûtant" },
    { de: "der Löffel", fr: "une cuillère" },
    { de: "die Gabel", fr: "une fourchette" },
    { de: "das Messer", fr: "un couteau" },
    { de: "der Teller", fr: "une assiette" },
    { de: "das Glas", fr: "un verre" },
    { de: "essen", fr: "manger" },
    { de: "trinken", fr: "boire" },
    { de: "probieren", fr: "goûter" },
    { de: "bestellen", fr: "commander" },
    { de: "bezahlen", fr: "payer" },
    { de: "Woraus besteht das Gericht?", fr: "De quoi est composé ce plat ?" },
    { de: "Was ist das Tagesgericht?", fr: "Quel est le plat du jour ?" },
    { de: "Gibt es vegetarische Gerichte?", fr: "Est-ce que vous avez des plats végétariens ?" },
    { de: "Gibt es Fisch?", fr: "Il y a du poisson ?" },
  ],
  "Zeit, Wetter & Ferien": [
    { de: "der Morgen", fr: "le matin" },
    { de: "der Mittag", fr: "le midi" },
    { de: "der Nachmittag", fr: "l’après-midi" },
    { de: "das Tagesende", fr: "la fin de journée" },
    { de: "der Abend", fr: "le soir" },
    { de: "die Nacht", fr: "la nuit" },
    { de: "Mitternacht", fr: "minuit" },
    { de: "die Sonne", fr: "le soleil" },
    { de: "der Regen", fr: "la pluie" },
    { de: "die Wolke", fr: "un nuage" },
    { de: "der Wind", fr: "le vent" },
    { de: "der Schnee", fr: "la neige" },
    { de: "der Himmel", fr: "le ciel" },
    { de: "die Temperatur", fr: "la température" },
    { de: "der Sommer", fr: "l’été" },
    { de: "im Sommer", fr: "en été" },
    { de: "der Winter", fr: "l’hiver" },
    { de: "im Winter", fr: "en hiver" },
    { de: "der Frühling", fr: "le printemps" },
    { de: "im Frühling", fr: "au printemps" },
    { de: "der Herbst", fr: "l’automne" },
    { de: "im Herbst", fr: "en automne" },
    { de: "die Ferien", fr: "les vacances" },
    { de: "der Berg", fr: "la montagne" },
    { de: "der Strand", fr: "la plage" },
    { de: "das Meer", fr: "la mer" },
    { de: "der See", fr: "le lac" },
    { de: "das Land", fr: "la campagne" },
    { de: "die Küste", fr: "la côte" },
    { de: "der Wald", fr: "la forêt" },
    { de: "der Campingplatz", fr: "un camping" },
    { de: "der Sonnenschirm", fr: "un parasol" },
    { de: "das Souvenir", fr: "un souvenir" },
    { de: "ins Ausland fahren", fr: "aller à l’étranger" },
    { de: "zu Hause bleiben", fr: "rester à la maison" },
    { de: "campen", fr: "camper / faire du camping" },
    { de: "schwimmen", fr: "nager" },
    { de: "baden", fr: "se baigner" },
    { de: "spazieren gehen", fr: "se promener" },
    { de: "besichtigen", fr: "visiter" },
    { de: "sich sonnen", fr: "bronzer" },
    { de: "sich ausruhen", fr: "se reposer" },
    { de: "sich entspannen", fr: "se détendre" },
    { de: "laufen", fr: "marcher" },
    { de: "der Ausflug", fr: "une excursion" },
    { de: "die Wanderung", fr: "la randonnée" },
    { de: "Es hat den ganzen Tag geregnet.", fr: "Il a plu toute la journée." },
    { de: "Das Wetter war schön.", fr: "Il a fait beau." },
    { de: "Es war kalt.", fr: "Il faisait froid." },
    { de: "Es war zu windig.", fr: "Il y avait trop de vent." },
  ],
  Ereignisse: [
    { de: "die Geburt", fr: "une naissance" },
    { de: "der Geburtstag", fr: "un anniversaire" },
    { de: "die Hochzeit", fr: "un mariage" },
    { de: "das Fest", fr: "une fête" },
    { de: "der Kuchen", fr: "un gâteau" },
    { de: "die Kerze", fr: "une bougie" },
    { de: "die Überraschung", fr: "une surprise" },
    { de: "das Bonbon", fr: "un bonbon" },
    { de: "das Getränk", fr: "une boisson" },
    { de: "der DJ", fr: "un DJ" },
    { de: "das Kostüm", fr: "un costume / un déguisement" },
    { de: "die Stimmung", fr: "une ambiance" },
    { de: "Spaß haben", fr: "s’amuser" },
    { de: "ein Geschenk mitbringen", fr: "apporter un cadeau" },
    { de: "Musik mitbringen", fr: "apporter de la musique" },
    { de: "einen Saal dekorieren", fr: "décorer une salle" },
    { de: "sich verkleiden", fr: "se déguiser" },
    { de: "ein Geschenk schenken", fr: "offrir un cadeau" },
    { de: "sich um die Getränke kümmern", fr: "s’occuper des boissons" },
    { de: "einen Kuchen vorbereiten", fr: "préparer un gâteau" },
    { de: "Wir haben uns gut amüsiert.", fr: "On s’est bien amusé." },
    { de: "Wir haben uns ein bisschen gelangweilt.", fr: "On s’est un peu ennuyé." },
    { de: "Es gab viele nette Leute.", fr: "Il y avait beaucoup de gens sympathiques." },
    { de: "Es war großartig!", fr: "C’était magnifique !" },
    { de: "Die Stimmung war super!", fr: "L’ambiance était super !" },
    { de: "Das hat mir sehr gefallen.", fr: "Ça m’a beaucoup plu !" },
    { de: "Ich habe es geliebt.", fr: "J’ai adoré." },
    { de: "Ich habe es gehasst.", fr: "J’ai détesté." },
    { de: "Das war der beste Tag meines Lebens.", fr: "C’était la meilleure journée de ma vie." },
    { de: "Das war der schlimmste Tag meines Lebens.", fr: "C’était la pire journée de ma vie." },
    { de: "Das ist eine gute Erinnerung.", fr: "C’est un bon souvenir." },
    { de: "Das ist eine schlechte Erinnerung.", fr: "C’est un mauvais souvenir." },
    { de: "Das hat mich schockiert.", fr: "Ça m’a choqué." },
    { de: "Ich war überrascht.", fr: "J’étais surpris / surprise." },
    { de: "Ich bin Fan von diesem Schauspieler.", fr: "Je suis fan de cet acteur." },
    { de: "Ich habe einen komischen Traum gehabt.", fr: "J’ai fait un drôle de rêve." },
    { de: "Ich habe einen Albtraum gehabt.", fr: "J’ai fait un mauvais rêve." },
    { de: "Ich war in einem Wald.", fr: "J’étais dans une forêt." },
    { de: "Wir werden viel Spaß haben.", fr: "On va bien s’amuser." },
    { de: "Das wird super!", fr: "Ça va être super !" },
    { de: "Ich freue mich schon.", fr: "J’ai hâte !" },
    { de: "Ich hoffe, dass ...", fr: "J’espère que ..." },
    { de: "Ich hoffe, meine Prüfung zu bestehen.", fr: "J’espère réussir mon examen." },
    { de: "Ich würde gern ins Kino gehen.", fr: "J’aimerais aller au cinéma." },
    { de: "Oh Mist!", fr: "Oh zut !" },
    { de: "Schade.", fr: "C’est dommage." },
  ],
  Tiere: [
    { de: "das Haustier", fr: "un animal domestique" },
    { de: "die Katze", fr: "un chat" },
    { de: "der Hund", fr: "un chien" },
    { de: "der Vogel", fr: "un oiseau" },
    { de: "der Goldfisch", fr: "un poisson rouge" },
    { de: "die Schildkröte", fr: "une tortue" },
    { de: "das Insekt", fr: "un insecte" },
    { de: "der Schmetterling", fr: "un papillon" },
    { de: "der Käfig", fr: "une cage" },
    { de: "die Hundehütte", fr: "une niche" },
    { de: "das Aquarium", fr: "un aquarium" },
    { de: "das Bauernhoftier", fr: "un animal de la ferme" },
    { de: "das Huhn", fr: "une poule" },
    { de: "die Kuh", fr: "une vache" },
    { de: "das Pferd", fr: "un cheval" },
    { de: "das Schaf", fr: "un mouton" },
    { de: "das Schwein", fr: "un cochon" },
  ],
  "DELF Heft Verständnis": [
    { de: "der Termin / das Treffen", fr: "rendez-vous" },
    { de: "wollen", fr: "vouloir" },
    { de: "teilnehmen", fr: "participer" },
    { de: "die Jagd / Schatzsuche", fr: "chasse" },
    { de: "das Viertel", fr: "quartier" },
    { de: "vor", fr: "devant" },
    { de: "Leder", fr: "cuir" },
    { de: "der Zustand", fr: "état" },
    { de: "kaufen", fr: "acheter" },
    { de: "neu", fr: "neuf / neuve" },
    { de: "es gibt", fr: "il y a" },
    { de: "anrufen", fr: "appeler" },
    { de: "der Abend", fr: "soir" },
    { de: "zu Hause / Wohnsitz", fr: "domicile" },
    { de: "Schüler der Mittelstufe", fr: "collégiens" },
    { de: "dienstags", fr: "mardis" },
    { de: "donnerstags", fr: "jeudis" },
    { de: "abends", fr: "soirs" },
    { de: "finden / lokalisieren", fr: "repérer" },
    { de: "die Zahlen / Ziffern", fr: "les chiffres" },
    { de: "angeben", fr: "indiquer" },
    { de: "geben", fr: "donner" },
    { de: "Stellenangebot / Jobangebot", fr: "offre d'emploi" },
    { de: "die Zeit", fr: "temps" },
    { de: "untenstehend", fr: "ci-dessous" },
    { de: "antworten", fr: "répondre" },
    { de: "sich bedanken", fr: "remercier" },
    { de: "wie viel / wie viele", fr: "combien" },
    { de: "folgende", fr: "suivantes" },
    { de: "nur / lediglich", fr: "seulement" },
    { de: "die Nahrung", fr: "nourriture" },
    { de: "geöffnet", fr: "ouvert / ouverte" },
    { de: "der Herr", fr: "monsieur" },
    { de: "das Thema", fr: "sujet" },
    { de: "jede / jeder", fr: "chaque" },
    { de: "ob / Frageeinleitung", fr: "est-ce que" },
    { de: "verfügbar", fr: "disponible" },
    { de: "Wie geht es dir?", fr: "comment vas-tu" },
    { de: "fitter / besser in Form", fr: "plus en forme" },
    { de: "das letzte Mal", fr: "la dernière fois" },
    { de: "hoffen", fr: "espérer" },
    { de: "können", fr: "pouvoir" },
    { de: "anfangen / beginnen", fr: "commencer" },
    { de: "morgen", fr: "demain" },
    { de: "gewinnen", fr: "gagner" },
    { de: "sehen", fr: "voir" },
    { de: "kommen wollen", fr: "vouloir venir" },
    { de: "wiederholen / lernen", fr: "réviser" },
    { de: "die Hausaufgabe / Pflicht", fr: "devoir" },
    { de: "senden", fr: "envoyer" },
    { de: "die Antworten", fr: "les réponses" },
    { de: "sein", fr: "être" },
    { de: "wann", fr: "quand" },
    { de: "korrigieren", fr: "corriger" },
    { de: "das Ende", fr: "la fin" },
    { de: "feiern", fr: "fêter" },
    { de: "vorschlagen", fr: "proposer" },
    { de: "picknicken", fr: "pique-niquer" },
    { de: "am Rand / am Ufer", fr: "au bord" },
    { de: "bringen", fr: "apporter" },
    { de: "das Gericht", fr: "plat" },
    { de: "der Abend / Party", fr: "soirée" },
    { de: "die E-Mail", fr: "courriel" },
    { de: "der Ausflug", fr: "sortie" },
    { de: "nächsten Sommer", fr: "l'été prochain" },
    { de: "am See", fr: "au lac" },
    { de: "im Stadion", fr: "au stade" },
    { de: "wie", fr: "comment" },
    { de: "Montreal", fr: "Montréal" },
    { de: "das Flugzeug", fr: "avion" },
    { de: "leider", fr: "malheureusement" },
    { de: "die Gesellschaft / Firma", fr: "compagnie" },
    { de: "verlieren", fr: "perdre" },
    { de: "wiederfinden", fr: "retrouver" },
    { de: "anhalten", fr: "arrêter" },
    { de: "wissen", fr: "savoir" },
    { de: "noch nicht", fr: "pas encore" },
    { de: "zufrieden / froh", fr: "content / contente" },
    { de: "nächste", fr: "prochaines" },
    { de: "die Wochen", fr: "les semaines" },
    { de: "ihm / ihr", fr: "lui" },
    { de: "verbessern", fr: "améliorer" },
    { de: "der Spaziergang", fr: "balade" },
    { de: "machen", fr: "faire" },
    { de: "während", fr: "pendant" },
    { de: "Liebe Grüße / Küsschen", fr: "bises" },
    { de: "die Brille", fr: "les lunettes" },
    { de: "vergessen", fr: "oublier" },
    { de: "sich erinnern", fr: "se rappeler" },
    { de: "nehmen", fr: "prendre" },
    { de: "die Schuhe", fr: "les chaussures" },
    { de: "laufen / gehen", fr: "marcher" },
    { de: "zusammen gehen", fr: "aller ensemble" },
    { de: "also / daher", fr: "donc" },
    { de: "nicht zu spät sein", fr: "ne pas être en retard" },
    { de: "die Fortsetzung / Folge", fr: "suite" },
    { de: "man muss", fr: "il faut" },
    { de: "die Ordnung", fr: "l'ordre" },
    { de: "schwierig", fr: "difficile" },
    { de: "sagen", fr: "dire" },
    { de: "falsch (fem.)", fr: "fausse" },
    { de: "das Kreuz", fr: "croix" },
    { de: "das Geld", fr: "l'argent" },
    { de: "notieren / erfassen / ablesen", fr: "relever" },
    { de: "die Unterkunft", fr: "logement" },
    { de: "die Gesundheit", fr: "santé" },
    { de: "lange Zeit", fr: "longtemps" },
    { de: "blockieren", fr: "bloquer" },
    { de: "hängen", fr: "pendre" },
    { de: "notwendig", fr: "nécessaire" },
    { de: "dank / dank ...", fr: "grâce" },
    { de: "die Linie", fr: "ligne" },
    { de: "wer", fr: "qui" },
    { de: "was", fr: "que" },
    { de: "was ist", fr: "qu'est-ce que" },
    { de: "wo", fr: "où" },
    { de: "wann", fr: "quand" },
    { de: "warum", fr: "pourquoi" },
    { de: "wie", fr: "comment" },
    { de: "wie viel", fr: "combien" },
    { de: "welcher", fr: "quel" },
    { de: "welche", fr: "quelle" },
    { de: "welche (Plural m.)", fr: "quels" },
    { de: "welche (Plural f.)", fr: "quelles" },
    { de: "der LKW", fr: "camion" },
    { de: "heftig / gewaltsam", fr: "violemment" },
    { de: "das Ereignis", fr: "l'événement" },
    { de: "Motor", fr: "moteur" },
    { de: "das Gewicht", fr: "poids" },
    { de: "schwer verletzt", fr: "blessés graves" },
    { de: "leicht verletzt", fr: "blessés légers" },
    { de: "fahren / führen", fr: "conduire" },
    { de: "die Feuerwehr / Feuerwehrleute", fr: "les pompiers" },
    { de: "der Verkehr", fr: "circulation" },
    { de: "wieder aufnehmen", fr: "reprendre" },
    { de: "der Vormittag", fr: "matinée" },
    { de: "das Jahr", fr: "année" },
    { de: "überschreiten", fr: "dépasser" },
    { de: "der Winter", fr: "hiver" },
    { de: "warten", fr: "attendre" },
    { de: "nehmen", fr: "prendre" },
    { de: "fragen", fr: "demander" },
    { de: "zurückkehren", fr: "rentrer" },
    { de: "früher", fr: "plus tôt" },
    { de: "geplant", fr: "prévu" },
    { de: "der Wettbewerb", fr: "compétition" },
    { de: "der Kampf", fr: "lutte" },
    { de: "es gab", fr: "il y avait" },
    { de: "viel", fr: "beaucoup" },
    { de: "der Teilnehmer", fr: "participant" },
    { de: "die Daten / Termine", fr: "les dates" },
    { de: "das Wiegen / das Abwiegen", fr: "pesée" },
    { de: "erste / erster", fr: "premier" },
    { de: "der Kampf", fr: "combat" },
    { de: "zweite / zweiter", fr: "deuxième" },
    { de: "zuerst", fr: "d'abord" },
    { de: "dann", fr: "ensuite" },
    { de: "schließlich", fr: "enfin" },
    { de: "kommen", fr: "venir" },
    { de: "setzen / legen / stellen", fr: "mettre" },
    { de: "vergleichen", fr: "comparer" },
    { de: "zählen", fr: "compter" },
    { de: "benutzen", fr: "utiliser" },
    { de: "beschreiben", fr: "décrire" },
    { de: "erzählen", fr: "raconter" },
  ],
  Chansons: [
    { de: "die Brille", fr: "les lunettes" },
    { de: "vergessen", fr: "oublier" },
    { de: "sich erinnern", fr: "se rappeler" },
    { de: "der Ausflug", fr: "sortie" },
    { de: "nehmen", fr: "prendre" },
    { de: "die Schuhe", fr: "les chaussures" },
    { de: "laufen / gehen", fr: "marcher" },
    { de: "zusammen gehen", fr: "aller ensemble" },
    { de: "also / daher", fr: "donc" },
    { de: "nicht zu spät sein", fr: "ne pas être en retard" },
    { de: "der Angestellte", fr: "employé" },
    { de: "die Folge / Fortsetzung", fr: "suite" },
    { de: "man muss", fr: "il faut" },
    { de: "die Ordnung", fr: "l'ordre" },
    { de: "schwierig", fr: "difficile" },
    { de: "sagen", fr: "dire" },
    { de: "falsch (fem.)", fr: "fausse" },
    { de: "das Kreuz", fr: "croix" },
    { de: "das Geld", fr: "l'argent" },
  ],
  "Sätze & Redemittel": [
    { de: "Hallo!", fr: "Salut !" },
    { de: "Guten Tag!", fr: "Bonjour !" },
    { de: "Hey!", fr: "Coucou !" },
    { de: "Wie geht’s?", fr: "Ça va ?" },
    { de: "Bis Samstag!", fr: "À samedi !" },
    { de: "Bis Sonntag!", fr: "À dimanche !" },
    { de: "Bis später!", fr: "À plus tard !" },
    { de: "Bis bald!", fr: "À bientôt !" },
    { de: "Küsschen / Liebe Grüße", fr: "Bisous / Bises." },
    { de: "Ich bin’s.", fr: "C’est moi." },
    { de: "Das ist Camille.", fr: "C’est Camille." },
    { de: "Ich bin Camille.", fr: "Je suis Camille." },
    { de: "Ich heiße Camille.", fr: "Je m’appelle Camille." },
    { de: "Meine Adresse ist ...", fr: "Mon adresse, c’est ..." },
    { de: "Ich wohne in ...", fr: "J’habite ..." },
    { de: "Ich wohne bei meinen Eltern.", fr: "Je vis chez mes parents." },
    { de: "Ich stelle dir ... vor", fr: "Je te présente ..." },
    { de: "Das ist mein Freund.", fr: "C’est mon ami." },
    { de: "Er ist Franzose.", fr: "Il est français." },
    { de: "Wie heißt du?", fr: "Comment tu t’appelles ?" },
    { de: "Wo wohnst du?", fr: "Tu habites où ?" },
    { de: "Wie alt bist du?", fr: "Tu as quel âge ?" },
    { de: "Woher kommst du?", fr: "Tu viens d’où ?" },
    { de: "Was machst du im Leben?", fr: "Qu’est-ce que tu fais dans la vie ?" },
    { de: "Was machst du gern?", fr: "Qu’est-ce que tu aimes faire ?" },
    { de: "Er bringt mich zum Lachen.", fr: "Il me fait rire." },
    { de: "Entschuldigen Sie, können Sie mir helfen?", fr: "Excusez-moi, vous pouvez m’aider s’il vous plaît ?" },
    { de: "Ich habe mich verlaufen.", fr: "Je suis perdu / perdue." },
    { de: "Wo ist der Marktplatz?", fr: "Où est la place du marché ?" },
    { de: "Wo befindet sich das Meeresmuseum?", fr: "Où se trouve le musée de la mer ?" },
    { de: "Ich möchte zum Eiffelturm.", fr: "Je voudrais aller à la Tour Eiffel." },
    { de: "Wie komme ich zur Place de la Comédie?", fr: "Comment je peux faire pour aller à la Place de la Comédie ?" },
    { de: "Ich suche die Metrostation Capitole.", fr: "Je cherche la station de métro Capitole." },
    { de: "Nehmen Sie die erste links, dann gehen Sie geradeaus.", fr: "Vous prenez la première à gauche, puis vous allez tout droit." },
    { de: "Überqueren Sie die Brücke und biegen Sie rechts ab.", fr: "Traversez le pont, et tournez à droite." },
    { de: "Man muss den Bus 86 nehmen und an der Haltestelle Balzac aussteigen.", fr: "Il faut prendre le bus 86 et descendre à l’arrêt Balzac." },
    { de: "Es ist ganz in der Nähe.", fr: "C’est tout près." },
    { de: "Es ist nicht weit.", fr: "Ce n’est pas loin." },
    { de: "Die Kirche befindet sich in der Temple-Straße.", fr: "L’église se trouve dans la rue du Temple." },
    { de: "Das Museum ist mitten im Park.", fr: "Le musée est au milieu du parc." },
    { de: "Es gibt Berge und Flüsse.", fr: "Il y a des montagnes et des fleuves." },
    { de: "Es ist flach.", fr: "C’est plat." },
    { de: "Es ist sehr grün.", fr: "C’est très vert." },
    { de: "Das Klima ist super.", fr: "Le climat est super." },
    { de: "Es ist zu heiß!", fr: "Il fait trop chaud !" },
    { de: "In dieser Region regnet es oft.", fr: "Dans cette région, il pleut souvent." },
    { de: "Es liegt im Süden von Frankreich.", fr: "Il se trouve au sud de la France." },
    { de: "Ich suche ein XL-T-Shirt für einen Freund.", fr: "Je cherche un tee-shirt XL pour un ami." },
    { de: "Ich hätte gern zwei Shorts.", fr: "Je voudrais deux shorts." },
    { de: "Super, ich nehme diesen Artikel!", fr: "Super, je prends cet article !" },
    { de: "Okay, ich kaufe es.", fr: "OK, je l’achète." },
    { de: "Sehr gut, ich nehme es.", fr: "Très bien, je le prends." },
    { de: "Wie viel kostet ein Ticket?", fr: "Combien coûte un ticket ?" },
    { de: "Gibt es eine Ermäßigung für Studenten?", fr: "Il y a une réduction pour les étudiants ?" },
    { de: "Ist das Museum jeden Tag geöffnet?", fr: "Le musée est ouvert tous les jours ?" },
    { de: "Haben Sie Gruppentarife?", fr: "Vous avez des tarifs de groupe ?" },
    { de: "Um wie viel Uhr beginnt der Film?", fr: "À quelle heure est-ce que le film commence ?" },
    { de: "Man kann viele Aktivitäten machen.", fr: "On peut faire plein d’activités." },
    { de: "Es gibt viele Dinge zu tun.", fr: "Il y a beaucoup de choses à faire." },
    { de: "Am Montag kannst du reiten.", fr: "Le lundi tu peux faire du cheval." },
    { de: "Kannst du auf meine Katze aufpassen?", fr: "Est-ce que tu pourrais garder mon chat ?" },
    { de: "Kannst du heute Abend dein Heft bei mir abholen?", fr: "Est-ce que tu peux venir chercher ton cahier chez moi, ce soir ?" },
    { de: "Könntest du Getränke mitbringen?", fr: "Tu pourrais apporter des boissons ?" },
    { de: "Kannst du mir bitte eine SMS schicken?", fr: "Tu peux m’envoyer un SMS, s’il te plaît ?" },
    { de: "Kannst du Marc bitte anrufen?", fr: "Tu peux appeler Marc pour lui dire, s’il te plaît ?" },
    { de: "Rufst du mich um 13 Uhr an, um zu bestätigen?", fr: "Tu m’appelles à 13 heures pour me confirmer ?" },
    { de: "Wann treffen wir uns? Und wo?", fr: "On se retrouve quand ? Et où ?" },
    { de: "Um wie viel Uhr sehen wir uns?", fr: "On se voit à quelle heure ?" },
    { de: "Treffpunkt wo?", fr: "Rendez-vous où ?" },
    { de: "Wann fährt der nächste Zug?", fr: "À quelle heure part le prochain train ?" },
    { de: "Gibt es eine Verbindung?", fr: "Est-ce qu’il y a une correspondance ?" },
    { de: "Wo muss man umsteigen?", fr: "Il faut changer où ?" },
    { de: "Wie lange dauert der Film?", fr: "Le film dure combien de temps ?" },
    { de: "Ist es lang?", fr: "C’est long ?" },
    { de: "Von wann bis wann?", fr: "C’est de quand à quand ?" },
    { de: "Komm gegen 18 Uhr zu mir.", fr: "Viens chez moi vers 18 heures." },
    { de: "Es ist von 17 bis 19 Uhr.", fr: "C’est de 17 heures à 19 heures." },
    { de: "Es beginnt um 20 Uhr.", fr: "Ça commence à 20 heures." },
    { de: "Es endet um 21 Uhr.", fr: "Ça finit à 21 heures." },
    { de: "Das Spiel ist am Freitag, dem 9. Januar.", fr: "Le match est le vendredi 9 janvier !" },
    { de: "Ich lerne seit 6 Monaten Französisch.", fr: "J’étudie le français depuis 6 mois." },
    { de: "Seit 10 Jahren wohne ich in Toulouse.", fr: "Ça fait 10 ans que j’habite à Toulouse." },
    { de: "Ich habe vor 4 Jahren angefangen, Gitarre zu spielen.", fr: "J’ai commencé à faire de la guitare il y a 4 ans." },
    { de: "Ich mache jeden Tag Sport.", fr: "Je fais du sport tous les jours." },
    { de: "Am Samstag mache ich meine Hausaufgaben.", fr: "Le samedi, je fais mes devoirs." },
    { de: "Manchmal gehe ich im Park laufen.", fr: "Parfois, je vais courir dans le parc." },
    { de: "Ich gehe oft in die Oper.", fr: "Je vais souvent à l’opéra." },
    { de: "Ich gehe nie in die Bibliothek.", fr: "Je ne vais jamais à la bibliothèque." },
    { de: "Willst du mit mir ins Theater kommen?", fr: "Tu veux venir avec moi au théâtre ?" },
    { de: "Wir gehen in den Park, kommst du mit?", fr: "On va au parc, tu viens avec nous ?" },
    { de: "Hast du diesen Sonntag Zeit?", fr: "Tu es libre ce dimanche ?" },
    { de: "Willst du am Samstagabend zu mir kommen?", fr: "Tu veux venir à la maison samedi soir ?" },
    { de: "Du kannst bei mir schlafen, wenn du willst.", fr: "Tu peux dormir chez moi si tu veux." },
    { de: "Bist du einverstanden, ins Kino zu gehen?", fr: "Tu es d’accord pour aller au ciné ?" },
    { de: "Komm schon!", fr: "Allez, viens !" },
    { de: "Bitte!", fr: "S’il te plaît !" },
    { de: "Sag ja!", fr: "Dis oui !" },
    { de: "Gehen wir zusammen, okay?", fr: "On y va ensemble, d’accord ?" },
    { de: "Wir könnten ihm eine Überraschung machen, oder?", fr: "On pourrait lui faire une surprise, non ?" },
    { de: "Hast du Lust, ins Schwimmbad zu gehen?", fr: "Ça te dit d’aller à la piscine ?" },
    { de: "Hast du Lust, in die Oper zu gehen?", fr: "Tu as envie d’aller à l’opéra ?" },
    { de: "Eine Partie Tennis, hast du Lust?", fr: "Une partie de tennis, ça te dit ?" },
    { de: "Treffen wir uns um 14 Uhr vor der Galerie?", fr: "On se retrouve à 14 heures devant la galerie ?" },
    { de: "Wir holen dich um 14:30 ab, passt das?", fr: "On passe te prendre à 14 h 30, ça va ?" },
    { de: "Wenn du einverstanden bist, treffen wir uns um 17 Uhr.", fr: "Si tu es d’accord, rendez-vous à 17 heures." },
    { de: "Wir sehen uns morgen Mittag, okay?", fr: "On se voit demain à midi, OK ?" },
    { de: "Treffpunkt Kino?", fr: "Rendez-vous au cinéma ?" },
    { de: "Tut mir leid, ich kann nicht.", fr: "Désolé / Désolée, je ne peux pas." },
    { de: "Ich habe keine Zeit.", fr: "Je ne suis pas libre." },
    { de: "Leider bin ich morgen nicht verfügbar.", fr: "Malheureusement, je ne suis pas disponible demain." },
    { de: "Ich konnte nicht kommen, es tut mir leid.", fr: "Je n’ai pas pu venir, je suis désolé / désolée." },
    { de: "Entschuldige mich.", fr: "Excuse-moi." },
    { de: "Verzeihung!", fr: "Pardon !" },
    { de: "Okay!", fr: "OK !" },
    { de: "Einverstanden!", fr: "D’accord." },
    { de: "Klappt!", fr: "Ça marche !" },
    { de: "Gern!", fr: "Avec plaisir !" },
    { de: "Ja, super!", fr: "Oui, super !" },
    { de: "Danke für die Einladung.", fr: "Merci pour l’invitation." },
    { de: "Ich danke dir.", fr: "Je te remercie." },
    { de: "Was denkst du darüber?", fr: "Qu’est-ce que tu en penses ?" },
    { de: "Was sagst du dazu?", fr: "Qu’est-ce que tu en dis ?" },
    { de: "Magst du es?", fr: "Est-ce que tu aimes ?" },
    { de: "Welchen Film bevorzugst du?", fr: "Tu préfères quel film ?" },
    { de: "Ein Eis, passt dir das?", fr: "Une glace, ça te va ?" },
    { de: "Bravo!", fr: "Bravo !" },
    { de: "Hut ab!", fr: "Chapeau bas !" },
    { de: "Glückwunsch!", fr: "Félicitations." },
    { de: "Ich freue mich für dich.", fr: "Je suis content pour toi." },
    { de: "Denk daran, dein Handtuch mitzunehmen.", fr: "Pense à prendre ta serviette." },
    { de: "Vergiss nicht, deinen Badeanzug mitzunehmen.", fr: "N’oublie pas de prendre ton maillot." },
    { de: "Ich rate dir, in dieses Museum zu gehen.", fr: "Je te conseille d’aller à ce musée." },
    { de: "Du musst diesen Film unbedingt sehen.", fr: "Tu dois absolument voir ce film, il est génial !" },
    { de: "Man muss Getränke mitbringen.", fr: "Il faut apporter des boissons." },
    { de: "Wir müssen Schwarz und Weiß tragen.", fr: "On doit s’habiller en noir et blanc." },
    { de: "Wir müssen um 16 Uhr dort sein.", fr: "On doit être là-bas à 16 heures." },
  ],
};

function extractReflexiveVerbs(vocab) {
  const resultMap = new Map();
  Object.values(vocab).forEach((arr) => {
    (arr || []).forEach((item) => {
      const fr = item?.fr || "";
      if (typeof fr === "string" && (fr.startsWith("se ") || fr.startsWith("s’") || fr.startsWith("s'"))) {
        const key = fr.toLowerCase();
        if (!resultMap.has(key)) {
          resultMap.set(key, { de: item.de, fr });
        }
      }
    });
  });
  return Array.from(resultMap.values());
}

const flattenVocabulary = (selectedCategories, vocab) =>
  selectedCategories.flatMap((category) =>
    (vocab[category] || []).map((item) => ({
      ...item,
      category,
      id: `${category}__${item.de}__${item.fr}`,
    }))
  );

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const STORAGE_KEY = "delf-a2-vocab-progress";
const LEGACY_STORAGE_KEYS = [
  "delf-a2-vocab-progress-v5",
  "delf-a2-vocab-progress-v4",
  "delf-a2-vocab-progress-v3",
  "delf-a2-vocab-progress-v2",
];
const DEFAULT_ACTIVE_BATCH_SIZE = 6;
const DEFAULT_HISTORY_SIZE = 5;
const TARGET_PERCENT = 90;
const MATCH_PAIR_COUNT = 5;
const TEST_OPTION_COUNT = 4;
const DEFAULT_INCLUDE_LEARNED_IN_FLASHCARDS = false;
const RUN_HISTORY_SIZE = 1;

const SUBJECTS = ["je", "tu", "il / elle", "nous", "vous", "ils / elles"];

const REGULAR_VERB_GROUPS = {
  er: {
    label: "-er",
    exampleVerbs: ["parler", "travailler", "aimer", "jouer"],
    presentEndings: ["e", "es", "e", "ons", "ez", "ent"],
    pastParticiple: "é",
  },
  ir: {
    label: "-ir",
    exampleVerbs: ["finir", "choisir", "grandir", "réussir"],
    presentEndings: ["is", "is", "it", "issons", "issez", "issent"],
    pastParticiple: "i",
  },
  re: {
    label: "-re",
    exampleVerbs: ["vendre", "attendre", "perdre", "répondre"],
    presentEndings: ["s", "s", "", "ons", "ez", "ent"],
    pastParticiple: "u",
  },
};

const IMPARFAIT_ENDINGS = ["ais", "ais", "ait", "ions", "iez", "aient"];

const GRAMMAR_TOPICS = [
  {
    id: "present",
    title: "Présent",
    description: "Für Dinge, die jetzt passieren, regelmäßig passieren oder allgemein gelten.",
    structure: "Sujet + verbe conjugué + complément",
    tips: [
      "Bei regelmäßigen Verben lernst du die Endungen der Gruppen -er, -ir und -re.",
      "Ein guter einfacher Satz auf A2-Niveau ist: Sujet + verbe + complément.",
      "Nutze Zeitwörter wie maintenant, aujourd’hui, souvent.",
    ],
    examples: [
      "Je parle français tous les jours.",
      "Nous finissons à 18 heures.",
      "Ils vendent des fruits au marché.",
    ],
  },
  {
    id: "passe-compose",
    title: "Passé composé",
    description: "Für abgeschlossene Handlungen in der Vergangenheit.",
    structure: "Sujet + avoir / être au présent + participe passé",
    tips: [
      "Die meisten Verben bilden das passé composé mit avoir.",
      "Bewegungsverben und reflexive Verben nutzen oft être.",
      "Mit être passt sich das participe passé an Geschlecht und Zahl an.",
    ],
    examples: [
      "J’ai parlé avec mon ami.",
      "Elle est allée au cinéma.",
      "Nous avons fini le travail.",
    ],
  },
  {
    id: "imparfait",
    title: "Imparfait",
    description: "Für Beschreibungen, Gewohnheiten und Hintergrund in der Vergangenheit.",
    structure: "Stamm von nous + ais, ais, ait, ions, iez, aient",
    tips: [
      "Imparfait beschreibt oft Situationen: il faisait beau, j’étais fatigué.",
      "Für regelmäßige Verben kannst du den nous-Stamm nutzen.",
      "Signalwörter: avant, souvent, d’habitude, quand j’étais petit.",
    ],
    examples: [
      "Quand j’étais petit, je jouais au foot.",
      "Il faisait froid et nous attendions le bus.",
      "Elle travaillait dans un café.",
    ],
  },
];

const SENTENCE_GUIDE = [
  {
    title: "Einfacher guter Satz",
    formula: "Sujet + verbe + complément",
    note: "Das ist die sicherste A2-Struktur.",
    examples: ["Je regarde un film.", "Nous visitons Paris."],
  },
  {
    title: "Satz mit Zeitwort",
    formula: "Temps + sujet + verbe + complément",
    note: "Zeitwörter machen den Satz klarer.",
    examples: ["Aujourd’hui, je travaille.", "Demain, nous allons au lac."],
  },
  {
    title: "Satz im passé composé",
    formula: "Sujet + avoir / être + participe passé + complément",
    note: "Für abgeschlossene Handlungen.",
    examples: ["J’ai acheté une PS5.", "Elle est rentrée plus tôt."],
  },
  {
    title: "Satz im imparfait",
    formula: "Sujet + verbe à l’imparfait + complément",
    note: "Für Gewohnheit oder Beschreibung in der Vergangenheit.",
    examples: ["Je travaillais le soir.", "Il faisait beau."],
  },
];

function normalizeStoredState(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      cardStats: {},
      activeBatchSize: DEFAULT_ACTIVE_BATCH_SIZE,
      historySize: DEFAULT_HISTORY_SIZE,
      includeLearnedInFlashcards: DEFAULT_INCLUDE_LEARNED_IN_FLASHCARDS,
    };
  }

  return {
    cardStats: raw.cardStats && typeof raw.cardStats === "object" ? raw.cardStats : {},
    activeBatchSize:
      typeof raw.activeBatchSize === "number" && raw.activeBatchSize > 0
        ? raw.activeBatchSize
        : DEFAULT_ACTIVE_BATCH_SIZE,
    historySize:
      typeof raw.historySize === "number" && raw.historySize > 0
        ? raw.historySize
        : DEFAULT_HISTORY_SIZE,
    includeLearnedInFlashcards:
      typeof raw.includeLearnedInFlashcards === "boolean"
        ? raw.includeLearnedInFlashcards
        : DEFAULT_INCLUDE_LEARNED_IN_FLASHCARDS,
  };
}

function persistTrainerState(cardStats, activeBatchSize, historySize, includeLearnedInFlashcards) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    cardStats,
    activeBatchSize,
    historySize,
    includeLearnedInFlashcards,
  });

  window.localStorage.setItem(STORAGE_KEY, payload);
  LEGACY_STORAGE_KEYS.forEach((key) => {
    if (key !== STORAGE_KEY) {
      window.localStorage.setItem(key, payload);
    }
  });
}

function loadTrainerState() {
  if (typeof window === "undefined") {
    return normalizeStoredState(null);
  }

  const keysToTry = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
  for (const key of keysToTry) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const normalized = normalizeStoredState(parsed);
      persistTrainerState(
        normalized.cardStats,
        normalized.activeBatchSize,
        normalized.historySize,
        normalized.includeLearnedInFlashcards
      );
      return normalized;
    } catch {
      continue;
    }
  }

  return normalizeStoredState(null);
}

function resolvePracticeDirection(direction) {
  if (direction === "mixed") {
    return Math.random() < 0.5 ? "de-fr" : "fr-de";
  }
  return direction;
}

function getSuccessHistory(stats, id) {
  return stats[id]?.history || [];
}

function getKnownPercent(stats, id, windowSize = null) {
  const fullHistory = getSuccessHistory(stats, id);
  const history = windowSize ? fullHistory.slice(-windowSize) : fullHistory;
  if (!history.length) return 0;
  const successCount = history.filter(Boolean).length;
  return Math.round((successCount / history.length) * 100);
}

function isLearned(stats, id, historySize) {
  const history = getSuccessHistory(stats, id);
  if (history.length < historySize) return false;
  return getKnownPercent(stats, id, historySize) >= TARGET_PERCENT;
}

function getLearnedCards(cards, stats, historySize) {
  return Array.isArray(cards)
    ? cards.filter((card) => isLearned(stats, card.id, historySize))
    : [];
}

function getLearningCards(cards, stats, historySize) {
  return Array.isArray(cards)
    ? cards.filter((card) => !isLearned(stats, card.id, historySize))
    : [];
}

function buildActivePool(cards, stats, activeBatchSize, historySize) {
  const unlearned = getLearningCards(cards, stats, historySize);
  return shuffle(unlearned).slice(0, activeBatchSize);
}

function buildFlashcardCycle(
  activePool,
  learnedCards = [],
  activeBatchSize = DEFAULT_ACTIVE_BATCH_SIZE,
  includeLearnedInFlashcards = false,
  excludedId = null
) {
  const safeLearned = Array.isArray(learnedCards) ? learnedCards : [];
  const baseSource =
    excludedId && activePool.length > 1
      ? activePool.filter((card) => card.id !== excludedId)
      : activePool;

  const reviewCount = includeLearnedInFlashcards ? (activeBatchSize <= 6 ? 1 : 2) : 0;
  const learnedCandidates = safeLearned.filter(
    (card) => card.id !== excludedId && !baseSource.some((base) => base.id === card.id)
  );
  const reviewCards = shuffle(learnedCandidates).slice(0, reviewCount);

  return shuffle([...baseSource, ...reviewCards]);
}

function buildMatchRound(allCards, excludeIds = []) {
  const safeCards = Array.isArray(allCards) ? allCards : [];
  const preferredPool = safeCards.filter((card) => !excludeIds.includes(card.id));
  const sourcePool =
    preferredPool.length >= Math.min(MATCH_PAIR_COUNT, safeCards.length)
      ? preferredPool
      : safeCards;
  const pairs = shuffle(sourcePool).slice(0, Math.min(MATCH_PAIR_COUNT, sourcePool.length));

  return {
    pairs,
    leftItems: shuffle(pairs.map((card) => ({ side: "left", cardId: card.id, label: card.de }))),
    rightItems: shuffle(pairs.map((card) => ({ side: "right", cardId: card.id, label: card.fr }))),
  };
}

function buildTestQuestion(cards, direction, excludedId = null) {
  const safeCards = Array.isArray(cards) ? cards : [];
  if (!safeCards.length) return null;

  const effectiveDirection = resolvePracticeDirection(direction);
  const pool =
    excludedId && safeCards.length > 1
      ? safeCards.filter((card) => card.id !== excludedId)
      : safeCards;

  const correctCard = shuffle(pool)[0] || pool[0];
  if (!correctCard) return null;

  const correctAnswer = effectiveDirection === "de-fr" ? correctCard.fr : correctCard.de;
  const distractors = shuffle(
    safeCards
      .filter((card) => card.id !== correctCard.id)
      .map((card) => (effectiveDirection === "de-fr" ? card.fr : card.de))
      .filter((value, index, array) => array.indexOf(value) === index && value !== correctAnswer)
  ).slice(0, Math.max(0, TEST_OPTION_COUNT - 1));

  return {
    card: correctCard,
    direction: effectiveDirection,
    prompt: effectiveDirection === "de-fr" ? correctCard.de : correctCard.fr,
    correctAnswer,
    options: shuffle([correctAnswer, ...distractors]),
  };
}

function applyResultsToStats(stats, results, historySize) {
  const nextStats = { ...stats };
  results.forEach(({ card, known }) => {
    const previous = getSuccessHistory(nextStats, card.id);
    nextStats[card.id] = {
      history: [...previous, known].slice(-historySize),
    };
  });
  return nextStats;
}

function buildRunQueue(cards) {
  return shuffle(Array.isArray(cards) ? cards : []);
}

function isRunLearned(stats, id) {
  const history = getSuccessHistory(stats, id);
  return history.length > 0 && history[history.length - 1] === true;
}

function getRunPercent(stats, id) {
  const history = getSuccessHistory(stats, id);
  if (!history.length) return 0;
  return history[history.length - 1] ? 100 : 0;
}

function refreshPoolAfterResults(activePool, availableCards, nextStats, activeBatchSize, historySize) {
  const stillActive = activePool.filter((card) => !isLearned(nextStats, card.id, historySize));
  const usedIds = new Set(stillActive.map((card) => card.id));
  const replacements = shuffle(
    availableCards.filter((card) => !usedIds.has(card.id) && !isLearned(nextStats, card.id, historySize))
  );

  const completedPool = [...stillActive];
  while (completedPool.length < activeBatchSize && replacements.length > 0) {
    completedPool.push(replacements.shift());
  }
  return completedPool;
}

function filterStatsForCategories(stats, categoriesToReset) {
  const prefixes = new Set(categoriesToReset.map((category) => `${category}__`));
  return Object.fromEntries(
    Object.entries(stats).filter(([id]) => !Array.from(prefixes).some((prefix) => id.startsWith(prefix)))
  );
}

function detectVerbGroup(infinitive) {
  if (infinitive.endsWith("er")) return "er";
  if (infinitive.endsWith("ir")) return "ir";
  if (infinitive.endsWith("re")) return "re";
  return "er";
}

function getVerbStem(infinitive, group, tense) {
  const baseStem = infinitive.slice(0, -2);
  if (tense === "imparfait" && group === "ir") {
    return `${baseStem}iss`;
  }
  return baseStem;
}

function conjugateRegularVerb(infinitive, group, tense, subjectIndex) {
  const stem = getVerbStem(infinitive, group, tense);
  if (tense === "present") {
    return `${stem}${REGULAR_VERB_GROUPS[group].presentEndings[subjectIndex]}`;
  }
  if (tense === "imparfait") {
    return `${stem}${IMPARFAIT_ENDINGS[subjectIndex]}`;
  }
  return infinitive;
}

function getPastParticiple(infinitive, group) {
  const stem = infinitive.slice(0, -2);
  return `${stem}${REGULAR_VERB_GROUPS[group].pastParticiple}`;
}

function buildConjugationQuestion(group, exerciseType, excludedKey = null) {
  const safeGroup = REGULAR_VERB_GROUPS[group] ? group : "er";
  const verbs = REGULAR_VERB_GROUPS[safeGroup].exampleVerbs;

  if (exerciseType === "participle") {
    const verbPool = excludedKey ? verbs.filter((verb) => verb !== excludedKey) : verbs;
    const verb = shuffle(verbPool)[0] || verbPool[0];
    if (!verb) return null;

    const correctAnswer = getPastParticiple(verb, safeGroup);
    const wrongOptions = shuffle([
      verb,
      `${verb.slice(0, -2)}ait`,
      `${verb.slice(0, -2)}e`,
      `${verb.slice(0, -2)}ons`,
    ])
      .filter((value) => value !== correctAnswer)
      .slice(0, TEST_OPTION_COUNT - 1);

    return {
      key: verb,
      group: safeGroup,
      exerciseType,
      prompt: `Participe passé von ${verb}`,
      helper: `${verb} → avoir / être + ...`,
      correctAnswer,
      options: shuffle([correctAnswer, ...wrongOptions]),
    };
  }

  const questionPool = verbs.flatMap((verb) =>
    SUBJECTS.map((subject, subjectIndex) => ({
      key: `${verb}-${exerciseType}-${subjectIndex}`,
      verb,
      subject,
      subjectIndex,
    }))
  );

  const filteredPool = excludedKey ? questionPool.filter((item) => item.key !== excludedKey) : questionPool;
  const chosen = shuffle(filteredPool)[0] || filteredPool[0];
  if (!chosen) return null;

  const correctAnswer = conjugateRegularVerb(chosen.verb, safeGroup, exerciseType, chosen.subjectIndex);
  const formsForSameVerb = SUBJECTS.map((_, index) =>
    conjugateRegularVerb(chosen.verb, safeGroup, exerciseType, index)
  ).filter((value) => value !== correctAnswer);
  const options = shuffle([correctAnswer, ...formsForSameVerb]).slice(0, TEST_OPTION_COUNT);

  return {
    key: chosen.key,
    group: safeGroup,
    exerciseType,
    prompt: `${chosen.subject} + ${chosen.verb}`,
    helper: exerciseType === "present" ? "Présent" : "Imparfait",
    correctAnswer,
    options,
  };
}

function runSelfChecks() {
  const stats = {
    a: { history: [true, true, true, true, false] },
    b: { history: [true, false] },
    c: { history: [] },
    "Familie__x": { history: [true] },
  };

  const samplePool = [
    { id: "1", de: "eins", fr: "un" },
    { id: "2", de: "zwei", fr: "deux" },
    { id: "3", de: "drei", fr: "trois" },
    { id: "4", de: "vier", fr: "quatre" },
    { id: "5", de: "fünf", fr: "cinq" },
    { id: "6", de: "sechs", fr: "six" },
  ];

  console.assert(getKnownPercent(stats, "a") === 80, "a sollte 80% haben");
  console.assert(isLearned(stats, "a", 5) === false, "a sollte mit 80% nicht als gelernt gelten");
  const longStats = { z: { history: [true, true, true, true, true, true, false] } };
  console.assert(getKnownPercent(longStats, "z", 5) === 80, "letzte 5 Antworten sollten ausgewertet werden");
  console.assert(isLearned(longStats, "z", 3) === true, "bei kleinerem Fenster sollte gelernt erkannt werden");
  console.assert(getKnownPercent(stats, "b") === 50, "b sollte 50% haben");
  console.assert(getKnownPercent(stats, "c") === 0, "c sollte 0% haben");

  const cycle = buildFlashcardCycle(samplePool.slice(0, 3), [], DEFAULT_ACTIVE_BATCH_SIZE, false, "1");
  console.assert(cycle.length === 2, "Zyklus sollte ausgeschlossene Karte weglassen");
  console.assert(!cycle.some((item) => item.id === "1"), "Ausgeschlossene Karte sollte nicht im Zyklus sein");
  const learnedMixCycle = buildFlashcardCycle(samplePool.slice(0, 3), samplePool.slice(3), 6, true, null);
  console.assert(learnedMixCycle.length === 4, "Bei aktivierter Wiederholung sollte 1 gelerntes Wort beigemischt werden");

  const round = buildMatchRound(samplePool, ["1"]);
  console.assert(round.pairs.length === 5, "Matching-Runde sollte 5 Paare enthalten");
  console.assert(!round.pairs.some((item) => item.id === "1"), "Ausgeschlossene IDs sollten nicht vorkommen");

  console.assert(filterStatsForCategories(stats, ["Familie"])["Familie__x"] === undefined, "Kategorie-Reset sollte Stats entfernen");

  const testQuestion = buildTestQuestion(samplePool, "de-fr", "1");
  console.assert(Boolean(testQuestion), "Testfrage sollte erzeugt werden");
  console.assert(testQuestion.options.length >= 1, "Testfrage sollte Optionen haben");

  console.assert(conjugateRegularVerb("parler", "er", "present", 0) === "parle", "parler au présent: je parle");
  console.assert(conjugateRegularVerb("finir", "ir", "imparfait", 3) === "finissions", "finir à l’imparfait: nous finissions");
  console.assert(getPastParticiple("vendre", "re") === "vendu", "Participe passé von vendre sollte vendu sein");
  console.assert(buildConjugationQuestion("er", "present")?.options.length >= 1, "Konjugationsfrage sollte Optionen haben");
}

runSelfChecks();

export default function DelfA2VocabTrainer() {
  const reflexiveVerbs = useMemo(() => extractReflexiveVerbs(vocabulary), []);

  const verbGroups = useMemo(() => {
    const er = [];
    const ir = [];
    const re = [];

    const normalizeFrenchEntry = (value) =>
      typeof value === "string" ? value.trim().toLowerCase().replace(/’/g, "'") : "";

    const isPlainInfinitiveVerb = (value) => {
      const s = normalizeFrenchEntry(value);
      if (!s) return false;
      if (s.includes(" ") || s.includes("/") || s.includes(",")) return false;
      if (/^(un|une|le|la|les|des|du|de la|de l'|l')/.test(s)) return false;
      return /^[a-zàâçéèêëîïôûùüÿœ'\-]+(er|ir|re)$/.test(s);
    };

    Object.values(vocabulary).forEach((arr) => {
      (arr || []).forEach((item) => {
        const fr = item?.fr || "";
        if (!isPlainInfinitiveVerb(fr)) return;

        const normalized = normalizeFrenchEntry(fr);
        if (normalized.endsWith("er")) {
          er.push(item);
        } else if (normalized.endsWith("ir")) {
          ir.push(item);
        } else if (normalized.endsWith("re")) {
          re.push(item);
        }
      });
    });

    const unique = (list) => {
      const map = new Map();
      list.forEach((item) => {
        const key = normalizeFrenchEntry(item.fr);
        if (!map.has(key)) map.set(key, item);
      });
      return Array.from(map.values());
    };

    return {
      "-er Verben": unique(er),
      "-ir Verben": unique(ir),
      "-re Verben": unique(re),
    };
  }, []);

  const isPlainInfinitiveVerb = (value) => {
    if (typeof value !== "string") return false;
    const s = value.trim().toLowerCase();
    if (s.includes(" ") || s.includes("/") || s.includes(",")) return false;
    if (/^(un|une|le|la|les|des|du|de la|de l'|l')/.test(s)) return false;
    return /^[a-zàâçéèêëîïôûùüÿœ'\-]+(er|ir|re)$/.test(s);
  };

  const cleanedVocabulary = useMemo(() => {
    const result = {};
    Object.entries(vocabulary).forEach(([key, arr]) => {
      result[key] = (arr || []).filter((item) => !isPlainInfinitiveVerb(item.fr));
    });
    return result;
  }, []);

  const allVocabulary = useMemo(
    () => ({
      ...cleanedVocabulary,
      "Reflexive Verben": reflexiveVerbs,
      ...verbGroups,
    }),
    [cleanedVocabulary, reflexiveVerbs, verbGroups]
  );
  const categories = Object.keys(allVocabulary);
  const [selectedCategories, setSelectedCategories] = useState(categories.slice(0, 4));
  const [direction, setDirection] = useState("de-fr");
  const [currentCardDirection, setCurrentCardDirection] = useState("de-fr");
  const [mode, setMode] = useState("flashcards");
  const [showAnswer, setShowAnswer] = useState(false);
  const [includeLearnedInFlashcards, setIncludeLearnedInFlashcards] = useState(DEFAULT_INCLUDE_LEARNED_IN_FLASHCARDS);
  const [activeBatchSize, setActiveBatchSize] = useState(DEFAULT_ACTIVE_BATCH_SIZE);
  const [historySize, setHistorySize] = useState(DEFAULT_HISTORY_SIZE);
  const [sessionKnownCount, setSessionKnownCount] = useState(0);
  const [sessionUnknownCount, setSessionUnknownCount] = useState(0);
  const [matchRound, setMatchRound] = useState({ pairs: [], leftItems: [], rightItems: [] });
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [wrongLeftId, setWrongLeftId] = useState(null);
  const [wrongRightId, setWrongRightId] = useState(null);
  const [matchFeedback, setMatchFeedback] = useState("");
  const [categoryResetTarget, setCategoryResetTarget] = useState("");
  const [pendingReset, setPendingReset] = useState(null);
  const [testQuestion, setTestQuestion] = useState(null);
  const [testAnswered, setTestAnswered] = useState(false);
  const [selectedTestAnswer, setSelectedTestAnswer] = useState("");
  const [testScore, setTestScore] = useState({ correct: 0, wrong: 0 });
  const [grammarTab, setGrammarTab] = useState("conjugation");
  const [grammarVerbGroup, setGrammarVerbGroup] = useState("er");
  const [grammarExerciseType, setGrammarExerciseType] = useState("present");
  const [grammarQuestion, setGrammarQuestion] = useState(null);
  const [selectedGrammarAnswer, setSelectedGrammarAnswer] = useState("");
  const [grammarAnswered, setGrammarAnswered] = useState(false);
  const [grammarScore, setGrammarScore] = useState({ correct: 0, wrong: 0 });
  const [runQueue, setRunQueue] = useState([]);
  const [runCurrent, setRunCurrent] = useState(null);
  const [runScore, setRunScore] = useState({ correct: 0, wrong: 0, done: 0 });
  const [cardStats, setCardStats] = useState({});
  const [activePool, setActivePool] = useState([]);
  const [flashcardQueue, setFlashcardQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const availableCards = useMemo(() => {
    const selected = selectedCategories.length ? selectedCategories : categories;
    return flattenVocabulary(selected, allVocabulary);
  }, [selectedCategories, allVocabulary]);

  const learnedCards = useMemo(
    () => getLearnedCards(availableCards, cardStats, historySize),
    [availableCards, cardStats, historySize]
  );
  const learningCards = useMemo(
    () => getLearningCards(availableCards, cardStats, historySize),
    [availableCards, cardStats, historySize]
  );
  const learnedPercent = availableCards.length ? Math.round((learnedCards.length / availableCards.length) * 100) : 0;

  const runLearnedCards = useMemo(
    () => availableCards.filter((card) => isRunLearned(cardStats, card.id)),
    [availableCards, cardStats]
  );
  const runLearnedPercent = availableCards.length
    ? Math.round((runLearnedCards.length / availableCards.length) * 100)
    : 0;

  const resetInteractionState = () => {
    setMatchedIds([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setWrongLeftId(null);
    setWrongRightId(null);
    setMatchFeedback("");
    setShowAnswer(false);
    setTestAnswered(false);
    setSelectedTestAnswer("");
  };

  const rebuildLearningState = (
    statsOverride,
    batchOverride = activeBatchSize,
    historyOverride = historySize,
    includeLearnedOverride = includeLearnedInFlashcards
  ) => {
    const nextPool = buildActivePool(availableCards, statsOverride, batchOverride, historyOverride);
    const nextRound = buildMatchRound(availableCards, []);
    const learnedPool = getLearnedCards(availableCards, statsOverride, historyOverride);
    const nextCycle = buildFlashcardCycle(nextPool, learnedPool, batchOverride, includeLearnedOverride);

    setActivePool(nextPool);
    setFlashcardQueue(nextCycle);
    setCurrent(nextCycle[0] || null);
    setCurrentCardDirection(resolvePracticeDirection(direction));
    setMatchRound(nextRound);
    resetInteractionState();
  };

  useEffect(() => {
    const normalized = loadTrainerState();
    setCardStats(normalized.cardStats);
    setActiveBatchSize(normalized.activeBatchSize);
    setHistorySize(normalized.historySize);
    setIncludeLearnedInFlashcards(normalized.includeLearnedInFlashcards);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    persistTrainerState(cardStats, activeBatchSize, historySize, includeLearnedInFlashcards);
  }, [cardStats, activeBatchSize, historySize, includeLearnedInFlashcards, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    rebuildLearningState(cardStats, activeBatchSize, historySize, includeLearnedInFlashcards);
  }, [availableCards, activeBatchSize, historySize, includeLearnedInFlashcards, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    const nextRunQueue = buildRunQueue(availableCards);
    setRunQueue(nextRunQueue);
    setRunCurrent(nextRunQueue[0] || null);
    setRunScore({ correct: 0, wrong: 0, done: 0 });
  }, [availableCards, isHydrated]);

  useEffect(() => {
    if (!current) return;
    setCurrentCardDirection(resolvePracticeDirection(direction));
  }, [current, direction]);

  const question = current ? (currentCardDirection === "de-fr" ? current.de : current.fr) : "Keine Karten verfügbar";

  const answer = current ? (currentCardDirection === "de-fr" ? current.fr : current.de) : "";

  const runQuestion = runCurrent
    ? currentCardDirection === "de-fr"
      ? runCurrent.de
      : runCurrent.fr
    : "Keine Karten verfügbar";

  const runAnswer = runCurrent ? (currentCardDirection === "de-fr" ? runCurrent.fr : runCurrent.de) : "";

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const commitStatsOnly = (results, statsBase = cardStats) => {
    const knownAdds = results.filter((result) => result.known).length;
    const unknownAdds = results.filter((result) => !result.known).length;

    if (knownAdds) setSessionKnownCount((prev) => prev + knownAdds);
    if (unknownAdds) setSessionUnknownCount((prev) => prev + unknownAdds);

    const nextStats = applyResultsToStats(statsBase, results, historySize);
    setCardStats(nextStats);
    return nextStats;
  };

  const markCard = (status) => {
    if (!current) return;

    const results = [{ card: current, known: status === "known" }];
    const nextStats = commitStatsOnly(results, cardStats);
    const refreshedPool = refreshPoolAfterResults(activePool, availableCards, nextStats, activeBatchSize, historySize);
    const nextRound = buildMatchRound(availableCards, matchRound.pairs.map((card) => card.id));
    const remainingQueue = flashcardQueue.slice(1);
    const learnedPool = getLearnedCards(availableCards, nextStats, historySize);
    const nextQueue =
      remainingQueue.length > 0
        ? remainingQueue
        : buildFlashcardCycle(refreshedPool, learnedPool, activeBatchSize, includeLearnedInFlashcards, current.id);

    setActivePool(refreshedPool);
    setFlashcardQueue(nextQueue);
    setCurrent(nextQueue[0] || null);
    setCurrentCardDirection(resolvePracticeDirection(direction));
    setMatchRound(nextRound);
    resetInteractionState();
  };

  const nextCard = () => {
    const remainingQueue = flashcardQueue.slice(1);
    const nextQueue =
      remainingQueue.length > 0
        ? remainingQueue
        : buildFlashcardCycle(activePool, learnedCards, activeBatchSize, includeLearnedInFlashcards, current?.id || null);

    setShowAnswer(false);
    setFlashcardQueue(nextQueue);
    setCurrent(nextQueue[0] || null);
    setCurrentCardDirection(resolvePracticeDirection(direction));
  };

  const finishMatchingRound = (statsOverride) => {
    const refreshedPool = refreshPoolAfterResults(activePool, availableCards, statsOverride, activeBatchSize, historySize);
    const nextRound = buildMatchRound(availableCards, matchRound.pairs.map((card) => card.id));
    const learnedPool = getLearnedCards(availableCards, statsOverride, historySize);
    const nextCycle = buildFlashcardCycle(
      refreshedPool,
      learnedPool,
      activeBatchSize,
      includeLearnedInFlashcards,
      current?.id || null
    );

    setActivePool(refreshedPool);
    setFlashcardQueue(nextCycle);
    setCurrent(nextCycle[0] || null);
    setCurrentCardDirection(resolvePracticeDirection(direction));
    setMatchRound(nextRound);
    resetInteractionState();
    setMatchFeedback("Neue Matching-Runde gestartet.");
  };

  const performFullReset = () => {
    setSessionKnownCount(0);
    setSessionUnknownCount(0);
    setTestScore({ correct: 0, wrong: 0 });
    setGrammarScore({ correct: 0, wrong: 0 });
    setCategoryResetTarget("");
    setCardStats({});

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      persistTrainerState({}, activeBatchSize, historySize, includeLearnedInFlashcards);
    }

    rebuildLearningState({}, activeBatchSize, historySize, includeLearnedInFlashcards);
  };

  const resetProgress = () => {
    setPendingReset({ type: "all" });
  };

  const performCategoryReset = (category) => {
    const nextStats = filterStatsForCategories(cardStats, [category]);
    setCardStats(nextStats);
    persistTrainerState(nextStats, activeBatchSize, historySize, includeLearnedInFlashcards);
    rebuildLearningState(nextStats, activeBatchSize, historySize, includeLearnedInFlashcards);
  };

  const resetSingleCategory = () => {
    if (!categoryResetTarget) return;
    setPendingReset({ type: "category", category: categoryResetTarget });
  };

  const buildNextTestQuestion = (excludedId = null) => {
    const next = buildTestQuestion(learnedCards, direction, excludedId);
    setTestQuestion(next);
    setTestAnswered(false);
    setSelectedTestAnswer("");
  };

  const handleTestAnswer = (option) => {
    if (!testQuestion || testAnswered) return;
    const isCorrect = option === testQuestion.correctAnswer;
    setSelectedTestAnswer(option);

    if (isCorrect) {
      setTestScore((prev) => ({ correct: prev.correct + 1, wrong: prev.wrong }));
      setTimeout(() => {
        buildNextTestQuestion(testQuestion.card.id);
      }, 300);
      return;
    }

    setTestAnswered(true);
    setTestScore((prev) => ({ correct: prev.correct, wrong: prev.wrong + 1 }));
  };

  const nextTestQuestion = () => {
    buildNextTestQuestion(testQuestion?.card?.id || null);
  };

  const resetTestScore = () => {
    setTestScore({ correct: 0, wrong: 0 });
    buildNextTestQuestion();
  };

  const markRunCard = (status) => {
    if (!runCurrent) return;
    const results = [{ card: runCurrent, known: status === "known" }];
    const nextStats = applyResultsToStats(cardStats, results, RUN_HISTORY_SIZE);
    setCardStats(nextStats);
    setRunScore((prev) => ({
      correct: prev.correct + (status === "known" ? 1 : 0),
      wrong: prev.wrong + (status === "unknown" ? 1 : 0),
      done: prev.done + 1,
    }));

    const remaining = runQueue.slice(1);
    setRunQueue(remaining);
    setRunCurrent(remaining[0] || null);
    setShowAnswer(false);
    setCurrentCardDirection(resolvePracticeDirection(direction));
  };

  const resetRun = () => {
    const nextRunQueue = buildRunQueue(availableCards);
    setRunQueue(nextRunQueue);
    setRunCurrent(nextRunQueue[0] || null);
    setRunScore({ correct: 0, wrong: 0, done: 0 });
    setShowAnswer(false);
    setCurrentCardDirection(resolvePracticeDirection(direction));
  };

  const handleMatchSelection = (item) => {
    if (matchedIds.includes(item.cardId)) return;
    if (wrongLeftId || wrongRightId) return;

    if (item.side === "left") {
      setSelectedLeft(item);
      return;
    }

    setSelectedRight(item);
  };

  useEffect(() => {
    if (mode !== "test") return;
    buildNextTestQuestion();
  }, [mode, direction, selectedCategories, historySize, cardStats]);

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;

    const leftCard = matchRound.pairs.find((card) => card.id === selectedLeft.cardId);
    const rightCard = matchRound.pairs.find((card) => card.id === selectedRight.cardId);
    if (!leftCard || !rightCard) {
      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }

    if (selectedLeft.cardId === selectedRight.cardId) {
      const results = [{ card: leftCard, known: true }];
      const nextStats = commitStatsOnly(results, cardStats);
      const nextMatchedIds = [...matchedIds, leftCard.id];
      setMatchedIds(nextMatchedIds);
      setMatchFeedback("Richtig verbunden.");
      setSelectedLeft(null);
      setSelectedRight(null);

      if (nextMatchedIds.length >= matchRound.pairs.length) {
        setTimeout(() => finishMatchingRound(nextStats), 250);
      }
      return;
    }

    setMatchFeedback("Falsch verbunden.");
    setWrongLeftId(selectedLeft.cardId);
    setWrongRightId(selectedRight.cardId);
    commitStatsOnly(
      [
        { card: leftCard, known: false },
        { card: rightCard, known: false },
      ],
      cardStats
    );

    const timeout = setTimeout(() => {
      setWrongLeftId(null);
      setWrongRightId(null);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatchFeedback("");
    }, 650);

    return () => clearTimeout(timeout);
  }, [selectedLeft, selectedRight, historySize]);

  const sortedLeftItems = useMemo(() => {
    const matched = matchRound.leftItems.filter((item) => matchedIds.includes(item.cardId));
    const remaining = matchRound.leftItems.filter((item) => !matchedIds.includes(item.cardId));
    return [...matched, ...remaining];
  }, [matchRound.leftItems, matchedIds]);

  const sortedRightItems = useMemo(() => {
    const matched = matchRound.rightItems.filter((item) => matchedIds.includes(item.cardId));
    const remaining = matchRound.rightItems.filter((item) => !matchedIds.includes(item.cardId));
    return [...matched, ...remaining];
  }, [matchRound.rightItems, matchedIds]);

  const grammarLesson = GRAMMAR_TOPICS.find((topic) => topic.id === grammarExerciseType) || GRAMMAR_TOPICS[0];
  const grammarEndings =
    grammarExerciseType === "present"
      ? REGULAR_VERB_GROUPS[grammarVerbGroup].presentEndings
      : grammarExerciseType === "imparfait"
        ? IMPARFAIT_ENDINGS
        : null;

  const buildNextGrammarQuestion = (excludedKey = null) => {
    const next = buildConjugationQuestion(grammarVerbGroup, grammarExerciseType, excludedKey);
    setGrammarQuestion(next);
    setGrammarAnswered(false);
    setSelectedGrammarAnswer("");
  };

  useEffect(() => {
    if (mode !== "grammar" || grammarTab !== "conjugation") return;
    buildNextGrammarQuestion();
  }, [mode, grammarTab, grammarVerbGroup, grammarExerciseType]);

  const handleGrammarAnswer = (option) => {
    if (!grammarQuestion || grammarAnswered) return;
    const isCorrect = option === grammarQuestion.correctAnswer;
    setSelectedGrammarAnswer(option);

    if (isCorrect) {
      setGrammarScore((prev) => ({ correct: prev.correct + 1, wrong: prev.wrong }));
      setTimeout(() => {
        buildNextGrammarQuestion(grammarQuestion.key);
      }, 300);
      return;
    }

    setGrammarAnswered(true);
    setGrammarScore((prev) => ({ correct: prev.correct, wrong: prev.wrong + 1 }));
  };

  const resetGrammarScore = () => {
    setGrammarScore({ correct: 0, wrong: 0 });
    buildNextGrammarQuestion();
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 p-6">
      <div className="max-w-6xl mx-auto grid gap-6">
        {pendingReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <h3 className="text-xl font-semibold mb-3">Reset bestätigen</h3>
              <p className="text-neutral-700 mb-6">
                {pendingReset.type === "all"
                  ? "Willst du wirklich den gesamten Fortschritt zurücksetzen?"
                  : `Willst du wirklich die Kategorie „${pendingReset.category}“ zurücksetzen?`}
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setPendingReset(null)} className="px-4 py-2 rounded-2xl border">
                  Abbrechen
                </button>
                <button
                  onClick={() => {
                    if (pendingReset.type === "all") {
                      performFullReset();
                    } else if (pendingReset.category) {
                      performCategoryReset(pendingReset.category);
                    }
                    setPendingReset(null);
                  }}
                  className="px-4 py-2 rounded-2xl border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Reset ausführen
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-2">DELF A2 Vokabeltrainer</h1>
          <p className="text-neutral-600">
            Vokabeln, Tests, Matching, Konjugation und Grammatik für Présent, Passé composé und Imparfait.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-neutral-500 mb-2">Aktive Wörter gleichzeitig</div>
            <input
              type="number"
              min={1}
              max={30}
              value={activeBatchSize}
              onChange={(e) => setActiveBatchSize(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
          <div>
            <div className="text-sm text-neutral-500 mb-2">Gespeicherte letzte Antworten</div>
            <input
              type="number"
              min={1}
              max={20}
              value={historySize}
              onChange={(e) => setHistorySize(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
          <div className="md:col-span-2 rounded-2xl border p-4 bg-neutral-50 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-neutral-500 mb-1">Gelernte Wörter bei Karteikarten wiederholen</div>
              <div className="text-sm text-neutral-700">
                Bei {activeBatchSize <= 6 ? "1" : "2"} zusätzlichen Wiederholungswort
                {activeBatchSize <= 6 ? "" : "en"} pro Durchgang
              </div>
            </div>
            <button
              onClick={() => setIncludeLearnedInFlashcards((prev) => !prev)}
              className={`px-4 py-2 rounded-2xl border ${includeLearnedInFlashcards ? "bg-neutral-900 text-white" : "bg-white"}`}
            >
              {includeLearnedInFlashcards ? "An" : "Aus"}
            </button>
          </div>
          <div className="md:col-span-2 grid md:grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <div className="text-sm text-neutral-500 mb-2">Einzelne Kategorie zurücksetzen</div>
              <select
                value={categoryResetTarget}
                onChange={(e) => setCategoryResetTarget(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3"
              >
                <option value="">Kategorie wählen</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={resetSingleCategory} className="px-5 py-3 rounded-2xl border">
              Kategorie resetten
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => {
                  setMode("flashcards");
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-2xl border ${mode === "flashcards" ? "bg-neutral-900 text-white" : "bg-white"}`}
              >
                Karteikarten
              </button>
              <button
                onClick={() => {
                  setMode("matching");
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-2xl border ${mode === "matching" ? "bg-neutral-900 text-white" : "bg-white"}`}
              >
                Verbinden
              </button>
              <button
                onClick={() => {
                  setMode("test");
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-2xl border ${mode === "test" ? "bg-neutral-900 text-white" : "bg-white"}`}
              >
                Vokabeltest
              </button>
              <button
                onClick={() => {
                  setMode("run");
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-2xl border ${mode === "run" ? "bg-neutral-900 text-white" : "bg-white"}`}
              >
                Run
              </button>
              <button
                onClick={() => {
                  setMode("grammar");
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-2xl border ${mode === "grammar" ? "bg-neutral-900 text-white" : "bg-white"}`}
              >
                Grammatik
              </button>
              <button
                onClick={() => {
                  setDirection("de-fr");
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-2xl border ${direction === "de-fr" ? "bg-neutral-900 text-white" : "bg-white"}`}
              >
                Deutsch → Französisch
              </button>
              <button
                onClick={() => {
                  setDirection("fr-de");
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-2xl border ${direction === "fr-de" ? "bg-neutral-900 text-white" : "bg-white"}`}
              >
                Französisch → Deutsch
              </button>
              <button
                onClick={() => {
                  setDirection("mixed");
                  setShowAnswer(false);
                }}
                className={`px-4 py-2 rounded-2xl border ${direction === "mixed" ? "bg-neutral-900 text-white" : "bg-white"}`}
              >
                Gemischt
              </button>
            </div>

            {mode === "flashcards" ? (
              <div className="rounded-3xl border p-8 min-h-[340px] flex flex-col justify-between bg-neutral-50">
                <div>
                  <div className="text-sm text-neutral-500 mb-2">
                    Kategorie: <span className="font-medium">{current?.category || "-"}</span>
                  </div>
                  <div className="text-sm text-neutral-500 mb-1">
                    Richtung:{" "}
                    <span className="font-medium">
                      {currentCardDirection === "de-fr" ? "Deutsch → Französisch" : "Französisch → Deutsch"}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-500 mb-4">
                    Trefferquote dieses Wortes:{" "}
                    <span className="font-medium">{current ? getKnownPercent(cardStats, current.id, historySize) : 0}%</span>
                    {current && ` (${Math.min(getSuccessHistory(cardStats, current.id).length, historySize)}/${historySize} Antworten)`}
                  </div>
                  <div className="text-3xl font-semibold leading-tight">{question}</div>
                  {showAnswer && (
                    <div className="mt-8 pt-6 border-t">
                      <div className="text-sm uppercase tracking-wide text-neutral-500 mb-2">Antwort</div>
                      <div className="text-2xl font-medium">{answer}</div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  <button onClick={() => setShowAnswer((prev) => !prev)} className="px-4 py-2 rounded-2xl bg-neutral-900 text-white">
                    {showAnswer ? "Antwort ausblenden" : "Antwort zeigen"}
                  </button>
                  <button onClick={() => markCard("known")} className="px-4 py-2 rounded-2xl border">
                    Gewusst
                  </button>
                  <button onClick={() => markCard("unknown")} className="px-4 py-2 rounded-2xl border">
                    Nochmal lernen
                  </button>
                  <button onClick={nextCard} className="px-4 py-2 rounded-2xl border">
                    Überspringen
                  </button>
                </div>
              </div>
            ) : mode === "run" ? (
              <div className="rounded-3xl border p-8 min-h-[340px] flex flex-col justify-between bg-neutral-50">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="text-sm text-neutral-500 mb-2">
                        Kategorie: <span className="font-medium">{runCurrent?.category || "-"}</span>
                      </div>
                      <div className="text-sm text-neutral-500 mb-1">
                        Richtung:{" "}
                        <span className="font-medium">
                          {currentCardDirection === "de-fr" ? "Deutsch → Französisch" : "Französisch → Deutsch"}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-500">
                        Run-Fortschritt: <span className="font-medium">{runScore.done} / {availableCards.length}</span>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-500 text-right">
                      <div>100%: {runScore.correct}</div>
                      <div>0%: {runScore.wrong}</div>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-500 mb-4">
                    Run-Wert dieses Wortes: <span className="font-medium">{runCurrent ? getRunPercent(cardStats, runCurrent.id) : 0}%</span>
                  </div>
                  <div className="text-3xl font-semibold leading-tight">{runQuestion}</div>
                  {showAnswer && (
                    <div className="mt-8 pt-6 border-t">
                      <div className="text-sm uppercase tracking-wide text-neutral-500 mb-2">Antwort</div>
                      <div className="text-2xl font-medium">{runAnswer}</div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  <button onClick={() => setShowAnswer((prev) => !prev)} className="px-4 py-2 rounded-2xl bg-neutral-900 text-white">
                    {showAnswer ? "Antwort ausblenden" : "Antwort zeigen"}
                  </button>
                  <button onClick={() => markRunCard("known")} className="px-4 py-2 rounded-2xl border">
                    Richtig = 100%
                  </button>
                  <button onClick={() => markRunCard("unknown")} className="px-4 py-2 rounded-2xl border">
                    Falsch = 0%
                  </button>
                  <button onClick={resetRun} className="px-4 py-2 rounded-2xl border">
                    Run neu starten
                  </button>
                </div>
              </div>
            ) : mode === "test" ? (
              <div className="rounded-3xl border p-6 min-h-[340px] bg-neutral-50 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-neutral-500">
                      Testet nur gelernte Wörter aus den ausgewählten Themen{direction === "mixed" ? " im gemischten Modus" : ""}
                    </div>
                    <div className="text-lg font-semibold">Vokabeltest</div>
                  </div>
                  <div className="text-sm text-neutral-500 text-right">
                    <div>Richtig: {testScore.correct}</div>
                    <div>Falsch: {testScore.wrong}</div>
                  </div>
                </div>

                {learnedCards.length === 0 || !testQuestion ? (
                  <div className="rounded-2xl border bg-white p-6 text-neutral-700">
                    Für die aktuell ausgewählten Themen gibt es noch keine gelernten Wörter für den Test.
                  </div>
                ) : (
                  <>
                    <div className="rounded-2xl border bg-white p-6">
                      <div className="text-sm text-neutral-500 mb-2">
                        Frage {testQuestion.direction === "de-fr" ? "Deutsch → Französisch" : "Französisch → Deutsch"}
                      </div>
                      <div className="text-3xl font-semibold leading-tight">{testQuestion.prompt}</div>
                    </div>

                    <div className="grid gap-3">
                      {testQuestion.options.map((option) => {
                        const isCorrect = option === testQuestion.correctAnswer;
                        const isSelected = selectedTestAnswer === option;
                        const variant = testAnswered
                          ? isCorrect
                            ? "bg-green-100 border-green-400"
                            : isSelected
                              ? "bg-red-100 border-red-400"
                              : "bg-white"
                          : "bg-white hover:bg-neutral-100";

                        return (
                          <button
                            key={option}
                            onClick={() => handleTestAnswer(option)}
                            disabled={testAnswered}
                            className={`w-full text-left px-4 py-3 rounded-2xl border transition ${variant}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button onClick={nextTestQuestion} className="px-4 py-2 rounded-2xl border">
                        Nächste Testfrage
                      </button>
                      <button onClick={resetTestScore} className="px-4 py-2 rounded-2xl border">
                        Test neu starten
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : mode === "grammar" ? (
              <div className="rounded-3xl border p-6 min-h-[340px] bg-neutral-50 flex flex-col gap-5">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setGrammarTab("conjugation")}
                    className={`px-4 py-2 rounded-2xl border ${grammarTab === "conjugation" ? "bg-neutral-900 text-white" : "bg-white"}`}
                  >
                    Konjugation
                  </button>
                  <button
                    onClick={() => setGrammarTab("tenses")}
                    className={`px-4 py-2 rounded-2xl border ${grammarTab === "tenses" ? "bg-neutral-900 text-white" : "bg-white"}`}
                  >
                    Zeiten
                  </button>
                  <button
                    onClick={() => setGrammarTab("sentences")}
                    className={`px-4 py-2 rounded-2xl border ${grammarTab === "sentences" ? "bg-neutral-900 text-white" : "bg-white"}`}
                  >
                    Satzbau
                  </button>
                </div>

                {grammarTab === "conjugation" ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-neutral-500 mb-2">Verbgruppe</div>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(REGULAR_VERB_GROUPS).map((group) => (
                            <button
                              key={group}
                              onClick={() => setGrammarVerbGroup(group)}
                              className={`px-4 py-2 rounded-2xl border ${grammarVerbGroup === group ? "bg-neutral-900 text-white" : "bg-white"}`}
                            >
                              {REGULAR_VERB_GROUPS[group].label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500 mb-2">Übung</div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "present", label: "Présent" },
                            { id: "imparfait", label: "Imparfait" },
                            { id: "participle", label: "Participe passé" },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setGrammarExerciseType(item.id)}
                              className={`px-4 py-2 rounded-2xl border ${grammarExerciseType === item.id ? "bg-neutral-900 text-white" : "bg-white"}`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-6">
                      <div className="text-sm text-neutral-500 mb-2">Muster</div>
                      <div className="text-lg font-semibold mb-3">
                        Beispielverben: {REGULAR_VERB_GROUPS[grammarVerbGroup].exampleVerbs.join(", ")}
                      </div>
                      {grammarExerciseType === "participle" ? (
                        <div className="text-neutral-700">
                          Participe passé: Stamm + <span className="font-semibold">{REGULAR_VERB_GROUPS[grammarVerbGroup].pastParticiple}</span>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-2 text-neutral-700">
                          {SUBJECTS.map((subject, index) => (
                            <div key={subject} className="rounded-xl border p-3 bg-neutral-50">
                              <span className="font-medium">{subject}</span>: {grammarEndings?.[index]}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm text-neutral-500">Training</div>
                        <div className="text-lg font-semibold">
                          Richtig: {grammarScore.correct} · Falsch: {grammarScore.wrong}
                        </div>
                      </div>
                    </div>

                    {grammarQuestion && (
                      <div className="rounded-2xl border bg-white p-6 flex flex-col gap-4">
                        <div>
                          <div className="text-sm text-neutral-500 mb-2">{grammarQuestion.helper}</div>
                          <div className="text-2xl font-semibold">{grammarQuestion.prompt}</div>
                        </div>
                        <div className="grid gap-3">
                          {grammarQuestion.options.map((option) => {
                            const isCorrect = option === grammarQuestion.correctAnswer;
                            const isSelected = selectedGrammarAnswer === option;
                            const variant = grammarAnswered
                              ? isCorrect
                                ? "bg-green-100 border-green-400"
                                : isSelected
                                  ? "bg-red-100 border-red-400"
                                  : "bg-white"
                              : "bg-white hover:bg-neutral-100";

                            return (
                              <button
                                key={option}
                                onClick={() => handleGrammarAnswer(option)}
                                disabled={grammarAnswered}
                                className={`w-full text-left px-4 py-3 rounded-2xl border transition ${variant}`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button onClick={() => buildNextGrammarQuestion(grammarQuestion.key)} className="px-4 py-2 rounded-2xl border">
                            Nächste Aufgabe
                          </button>
                          <button onClick={resetGrammarScore} className="px-4 py-2 rounded-2xl border">
                            Training neu starten
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : grammarTab === "tenses" ? (
                  <div className="grid gap-4">
                    {GRAMMAR_TOPICS.map((topic) => (
                      <div key={topic.id} className="rounded-2xl border bg-white p-6">
                        <div className="text-sm text-neutral-500 mb-1">{topic.title}</div>
                        <div className="text-lg font-semibold mb-2">{topic.structure}</div>
                        <div className="text-neutral-700 mb-3">{topic.description}</div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium mb-2">Besonderheiten</div>
                            <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                              {topic.tips.map((tip) => (
                                <li key={tip}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="font-medium mb-2">Beispiele</div>
                            <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                              {topic.examples.map((example) => (
                                <li key={example}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {SENTENCE_GUIDE.map((item) => (
                      <div key={item.title} className="rounded-2xl border bg-white p-6">
                        <div className="text-sm text-neutral-500 mb-1">{item.title}</div>
                        <div className="text-lg font-semibold mb-2">{item.formula}</div>
                        <div className="text-neutral-700 mb-3">{item.note}</div>
                        <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                          {item.examples.map((example) => (
                            <li key={example}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border p-6 min-h-[340px] bg-neutral-50">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm text-neutral-500">Verbinde 5 Vokabelpaare</div>
                    <div className="text-lg font-semibold">Richtig = grün, falsch = kurz rot, danach nochmal probieren</div>
                  </div>
                  <div className="text-sm text-neutral-500">
                    Gelöst: {matchedIds.length} / {matchRound.pairs.length}
                  </div>
                </div>

                {matchFeedback && <div className="mb-4 text-sm font-medium text-neutral-700">{matchFeedback}</div>}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {sortedLeftItems.map((item) => {
                      const isSelected = selectedLeft?.cardId === item.cardId;
                      const isDone = matchedIds.includes(item.cardId);
                      const isWrong = wrongLeftId === item.cardId;
                      return (
                        <button
                          key={`left-${item.cardId}`}
                          onClick={() => handleMatchSelection(item)}
                          disabled={isDone}
                          className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                            isDone
                              ? "bg-green-100 border-green-400"
                              : isWrong
                                ? "bg-red-100 border-red-400"
                                : isSelected
                                  ? "bg-neutral-900 text-white"
                                  : "bg-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="space-y-3">
                    {sortedRightItems.map((item) => {
                      const isSelected = selectedRight?.cardId === item.cardId;
                      const isDone = matchedIds.includes(item.cardId);
                      const isWrong = wrongRightId === item.cardId;
                      return (
                        <button
                          key={`right-${item.cardId}`}
                          onClick={() => handleMatchSelection(item)}
                          disabled={isDone}
                          className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                            isDone
                              ? "bg-green-100 border-green-400"
                              : isWrong
                                ? "bg-red-100 border-red-400"
                                : isSelected
                                  ? "bg-neutral-900 text-white"
                                  : "bg-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Themen auswählen</h2>
            <div className="grid gap-2 max-h-[420px] overflow-auto pr-1">
              {categories.map((category) => {
                const active = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`text-left px-4 py-3 rounded-2xl border transition ${active ? "bg-neutral-900 text-white" : "bg-white"}`}
                  >
                    <div className="font-medium">{category}</div>
                    <div className={`text-sm ${active ? "text-neutral-200" : "text-neutral-500"}`}>
                      {(allVocabulary[category] || []).length} Karten
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="text-sm text-neutral-500">Aktive Lernwörter</div>
            <div className="text-3xl font-bold mt-1">
              {activePool.length} / {activeBatchSize}
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="text-sm text-neutral-500">Gewusst in dieser Sitzung</div>
            <div className="text-3xl font-bold mt-1">{sessionKnownCount}</div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="text-sm text-neutral-500">Nochmal lernen in dieser Sitzung</div>
            <div className="text-3xl font-bold mt-1">{sessionUnknownCount}</div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="text-sm text-neutral-500">Gelernt</div>
            <div className="text-3xl font-bold mt-1">{mode === "run" ? runLearnedPercent : learnedPercent}%</div>
            <div className="text-sm text-neutral-500 mt-2">
              {mode === "run"
                ? `${runLearnedCards.length} von ${availableCards.length} Wörtern sind im Run aktuell bei 100%.`
                : `${learnedCards.length} von ${availableCards.length} Wörtern haben 90%+ in den letzten ${historySize} Antworten.`}
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-6 md:col-span-3">
            <div className="text-sm text-neutral-500 mb-3">Lernlogik</div>
            <div className="text-base text-neutral-700 mb-4">
              Es sind immer maximal {activeBatchSize} Wörter gleichzeitig aktiv. Im Karteikarten-Modus wird zuerst jedes aktive Wort genau einmal pro Durchgang abgefragt. Erst wenn alle aktiven Wörter einmal dran waren, wird der nächste zufällige Durchgang mit denselben aktiven Wörtern erzeugt. Wenn die Wiederholungsfunktion aktiv ist, werden zusätzlich gelernte Wörter beigemischt: bei 6 oder weniger aktiven Wörtern 1 gelerntes Wort, ab 7 aktiven Wörtern 2 gelernte Wörter. Wird ein gelerntes Wort falsch beantwortet, greift wieder die Regel der letzten {historySize} Antworten und das Wort muss bei Bedarf erneut erlernt werden. Im Run-Modus gehst du jede Karte genau einmal durch: richtig setzt das Wort sofort auf 100%, falsch sofort auf 0%.
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border p-4 bg-neutral-50">
                <div className="font-semibold mb-2">Noch lernen</div>
                <div>{learningCards.length} Wörter</div>
              </div>
              <div className="rounded-2xl border p-4 bg-neutral-50">
                <div className="font-semibold mb-2">Schon gelernt</div>
                <div>{mode === "run" ? runLearnedCards.length : learnedCards.length} Wörter</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 flex justify-center">
          <button
            onClick={resetProgress}
            className="px-6 py-3 rounded-2xl border border-red-300 text-red-600 hover:bg-red-50"
          >
            Gesamten Fortschritt zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
}
