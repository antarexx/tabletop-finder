import SearchPage from "../../../components/SearchPage";

export default function SearchIt() {
  return (
    <SearchPage
      lang="it"
      strings={{
        title: "Trova giocatori vicino a te",
        subtitle: "Scegli cosa giochi e dove. Al resto pensiamo noi.",
        gameTypeLabel: "Tipo di gioco",
        gameTypeHint: "Seleziona almeno uno.",
        locationLabel: "Posizione",
        locationPlaceholder: "Città, CAP o zona",
        radiusLabel: "Raggio",
        lookingForLabel: "Cerco",
        viewLabel: "Vista",
        listView: "Lista",
        mapView: "Mappa",
        searchBtn: "Cerca",
        resetBtn: "Azzera filtri",
        validationGame: "Seleziona almeno un tipo di gioco.",
        validationLocation: "Inserisci una posizione.",
        resultsTitle: "Risultati",
        emptyTitle: "Nessun risultato per ora",
        emptyBody: "Prova ad aumentare il raggio o pubblica un annuncio.",
        createListing: "Pubblica un annuncio",
        privacyNote:
          "Privacy: utenti/gruppi sono mostrati con posizione approssimata. I luoghi pubblici possono essere mostrati in modo preciso.",
      }}
    />
  );
}
