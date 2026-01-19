import SearchPage from "../../../components/SearchPage";

export default function SearchEn() {
  return (
    <SearchPage
      lang="en"
      strings={{
        title: "Find players near you",
        subtitle: "Choose what you play and where. We’ll handle the rest.",
        gameTypeLabel: "Game type",
        gameTypeHint: "Select at least one.",
        locationLabel: "Location",
        locationPlaceholder: "City, ZIP code, or area",
        radiusLabel: "Radius",
        lookingForLabel: "Looking for",
        viewLabel: "View",
        listView: "List",
        mapView: "Map",
        searchBtn: "Search",
        resetBtn: "Reset filters",
        validationGame: "Please select at least one game type.",
        validationLocation: "Please enter a location.",
        resultsTitle: "Results",
        emptyTitle: "No results yet",
        emptyBody: "Try increasing the radius or create a listing.",
        createListing: "Create a listing",
        privacyNote:
          "Privacy: users/groups are shown with approximate location. Public places can be shown precisely.",
      }}
    />
  );
}
