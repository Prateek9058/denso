import React, { ChangeEvent } from "react";
import { 
  Grid, 
  DialogTitle, 
  DialogContent,
  styled,
  Paper
} from '@mui/material';
import { MapContainer, ImageOverlay, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useForm } from "react-hook-form";
import CustomTextField from "@/app/(components)/mui-components/Text-Field's";

// Styled components using MUI's styled API
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  padding: 0,
  height: 710,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: theme.shadows[1],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'relative'
}));

const MapWrapper = styled('div')({
  height: '100%',
  width: '100%'
});

// Types
interface Point {
  coordinates: [number, number];
  showMarker: boolean;
}
interface PointWithMarker {
  coordinates: Point;
  showMarker?: boolean;
}
interface FinalDetailsProps {
  points: PointWithMarker[];
}

const FinalDetails: React.FC<FinalDetailsProps> = ({
    points,
  }) => {
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  const bounds: [[number, number], [number, number]] = [
    [0, 0],
    [100, 220]
  ];

  const trolleyIcon = L.icon({
    iconUrl: '/Img/trolleyLive.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name, value);
    if (errors[name]) {
      clearErrors(name);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <StyledDialogTitle>
          <MapWrapper>
            <MapContainer
              center={[50, 50]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
              crs={L.CRS.Simple}
              minZoom={-2}
              maxZoom={4}
            >
              <ImageOverlay 
                url="/Img/Layoutdenso.png"
                bounds={bounds}
                eventHandlers={{
                  error: (e) => {
                    console.error('Error loading image:', e);
                  }
                }}
              />
              
              <Polyline
                positions={points.map(point => point.coordinates)}
                color="blue"
                weight={2}
              />
              
              {points.map((point, index) => 
                point.showMarker && (
                  <Marker
                    key={index}
                    position={point.coordinates}
                    icon={trolleyIcon}
                  />
                )
              )}
            </MapContainer>
          </MapWrapper>
        </StyledDialogTitle>

        <DialogContent>
          <Grid 
            container 
            spacing={2} 
            sx={{ mt: 2 }}
          >
            {/* First row - three equal fields */}
            {[1, 2, 3].map((_, index) => (
              <Grid item xs={12} md={5.8} key={`field-large-${index}`}>
                <CustomTextField
                  {...register(`trolleyId${index}`, {
                    required: "Trolley ID is required",
                  })}
                  name={`trolleyId${index}`}
                  label="Trolley ID"
                  placeholder="Enter Trolley ID"
                  error={!!errors[`trolleyId${index}`]}
                  helperText={errors[`trolleyId${index}`]?.message}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            ))}

            {/* Second row - two smaller fields */}
            {[1, 2].map((_, index) => (
              <Grid item xs={12} md={2.7} key={`field-small-${index}`}>
                <CustomTextField
                  {...register(`smallField${index}`, {
                    required: "Field is required",
                  })}
                  name={`smallField${index}`}
                  label="Trolley ID"
                  placeholder="Enter Trolley ID"
                  error={!!errors[`smallField${index}`]}
                  helperText={errors[`smallField${index}`]?.message}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            ))}

            {/* Last field */}
            <Grid item xs={12} md={5.8}>
              <CustomTextField
                {...register("lastField", {
                  required: "Field is required",
                })}
                name="lastField"
                label="Trolley ID"
                placeholder="Enter Trolley ID"
                error={!!errors.lastField}
                helperText={errors.lastField?.message}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Grid>
    </Grid>
  );
};

export default FinalDetails;