import React from "react";
import { Button } from "@mui/material";
import { MapButton } from "./../styles/Styles";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface MapLinkButtonProps {
  location: Location;
  label: string;
}

function isMobileDevice(): boolean {
  return /Mobi|Android/i.test(navigator.userAgent);
}

const MapLinkButton: React.FC<MapLinkButtonProps> = ({ location, label }) => {
  const handleButtonClick = () => {
    const isMobile = isMobileDevice();
    const encodedName = encodeURIComponent(location.name);
    const googleMapsBaseUrl = isMobile
      ? `geo:${location.lat},${location.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedName}@${location.lat},${location.lng}`;

    const googleMapsUrl = isMobile
      ? `${googleMapsBaseUrl}?q=${encodedName}`
      : googleMapsBaseUrl;

    window.open(googleMapsUrl, "_blank");
  };

  return (
    <Button onClick={handleButtonClick} style={MapButton}>
      {label}
    </Button>
  );
};

export default MapLinkButton;
