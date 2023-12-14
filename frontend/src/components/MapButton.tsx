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
    const encodedName = encodeURIComponent(location.name);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodedName}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <Button onClick={handleButtonClick} style={MapButton}>
      {label}
    </Button>
  );
};

export default MapLinkButton;
