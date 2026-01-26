import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Grid,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import ListIcon from "@mui/icons-material/List";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "@/styles/rental.module.scss";

export default function FieldReservationPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [region, setRegion] = useState("all");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fieldSize, setFieldSize] = useState("");
  const [indoorOutdoor, setIndoorOutdoor] = useState("");
  const [floorType, setFloorType] = useState("");

  // Mock field data
  const fields = [
    {
      id: 1,
      venueName: "Goyang Daily Ground Futsal Center Madu",
      amenities: ["Parking", "Restroom (Separated)", "Vest Rental", "Ball Rental"],
      location: "Goyang",
      fields: [
        {
          id: 1,
          name: "Single Field",
          size: "40x20m",
          indoorOutdoor: "Outdoor",
          floorType: "Artificial Turf",
          price: "55,000원/hour",
          status: "available",
          timeSlots: [
            { time: "06:00", available: true },
            { time: "12:00", available: true },
            { time: "18:00", available: true },
            { time: "00:00", available: false },
          ],
        },
      ],
    },
    {
      id: 2,
      venueName: "Goyang Soccer Story Unjeong",
      amenities: ["Parking", "Restroom (Separated)"],
      location: "Goyang",
      fields: [
        {
          id: 1,
          name: "Indoor A Field",
          size: "18x8m",
          indoorOutdoor: "Indoor",
          floorType: "Artificial Turf",
          price: "30,000원/hour",
          status: "available",
          timeSlots: [
            { time: "06:00", available: true },
            { time: "12:00", available: true },
            { time: "18:00", available: true },
            { time: "00:00", available: false },
          ],
        },
        {
          id: 2,
          name: "Indoor B Field",
          size: "18x8m",
          indoorOutdoor: "Indoor",
          floorType: "Artificial Turf",
          price: "Reservation Closed",
          status: "closed",
          timeSlots: [
            { time: "06:00", available: false },
            { time: "12:00", available: false },
            { time: "18:00", available: false },
            { time: "00:00", available: false },
          ],
        },
        {
          id: 3,
          name: "Outdoor Field",
          size: "38x18m",
          indoorOutdoor: "Outdoor",
          floorType: "Artificial Turf",
          price: "Reservation Closed",
          status: "closed",
          timeSlots: [
            { time: "06:00", available: false },
            { time: "12:00", available: false },
            { time: "18:00", available: false },
            { time: "00:00", available: false },
          ],
        },
      ],
    },
    {
      id: 3,
      venueName: "Goyang iTWO Football Club",
      amenities: ["Parking", "Restroom (Separated)", "Vest Rental", "Ball Rental"],
      location: "Goyang",
      fields: [
        {
          id: 1,
          name: "Single Field",
          size: "34x18m",
          indoorOutdoor: "Outdoor",
          floorType: "Artificial Turf",
          price: "50,000원/hour",
          status: "available",
          timeSlots: [
            { time: "06:00", available: true },
            { time: "12:00", available: true },
            { time: "18:00", available: true },
            { time: "00:00", available: false },
          ],
        },
      ],
    },
    {
      id: 4,
      venueName: "Guri Daebok Futsal Park",
      amenities: ["Parking", "Restroom (Separated)", "Vest Rental", "Ball Rental"],
      location: "Guri",
      fields: [
        {
          id: 1,
          name: "A Field",
          size: "40x20m",
          indoorOutdoor: "Outdoor",
          floorType: "Artificial Turf",
          price: "55,000원/hour",
          status: "available",
          timeSlots: [
            { time: "06:00", available: true },
            { time: "12:00", available: true },
            { time: "18:00", available: true },
            { time: "00:00", available: false },
          ],
        },
        {
          id: 2,
          name: "B Field",
          size: "40x20m",
          indoorOutdoor: "Outdoor",
          floorType: "Artificial Turf",
          price: "55,000원/hour",
          status: "available",
          timeSlots: [
            { time: "06:00", available: true },
            { time: "12:00", available: true },
            { time: "18:00", available: true },
            { time: "00:00", available: false },
          ],
        },
        {
          id: 3,
          name: "C Field",
          size: "30x17m",
          indoorOutdoor: "Outdoor",
          floorType: "Artificial Turf",
          price: "50,000원/hour",
          status: "available",
          timeSlots: [
            { time: "06:00", available: true },
            { time: "12:00", available: true },
            { time: "18:00", available: true },
            { time: "00:00", available: false },
          ],
        },
      ],
    },
  ];

  const getTodayDate = () => {
    const today = new Date();
    const month = today.toLocaleString("en-US", { month: "long" });
    const day = today.getDate();
    const dayName = today.toLocaleString("en-US", { weekday: "long" });
    return `${month} ${day}, ${dayName}`;
  };

  return (
    <>
      <Head>
        <title>Field Reservation - KickUp</title>
        <meta
          name="description"
          content="Reserve football and futsal fields on KickUp."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box className={styles.rentalPage}>
        {/* Filters Section */}
        <Container maxWidth="lg">
          <Box className={styles.filtersSection}>
            <Box className={styles.viewModeToggle}>
              <IconButton
                onClick={() => setViewMode("list")}
                className={`${styles.viewModeButton} ${viewMode === "list" ? styles.viewModeActive : ""}`}
              >
                <ListIcon />
              </IconButton>
              <IconButton
                onClick={() => setViewMode("map")}
                className={`${styles.viewModeButton} ${viewMode === "map" ? styles.viewModeActive : ""}`}
              >
                <MapIcon />
              </IconButton>
            </Box>

            <FormControl className={styles.filterControl}>
              <Select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="all">All Regions</MenuItem>
                <MenuItem value="seoul">Seoul</MenuItem>
                <MenuItem value="goyang">Goyang</MenuItem>
                <MenuItem value="guri">Guri</MenuItem>
                <MenuItem value="gimpo">Gimpo</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterControl}>
              <Select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="">{getTodayDate()}</MenuItem>
                <MenuItem value="tomorrow">Tomorrow</MenuItem>
                <MenuItem value="day-after">Day After Tomorrow</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterControl}>
              <Select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="">Time</MenuItem>
                <MenuItem value="06:00">06:00</MenuItem>
                <MenuItem value="12:00">12:00</MenuItem>
                <MenuItem value="18:00">18:00</MenuItem>
                <MenuItem value="00:00">00:00</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterControl}>
              <Select
                value={fieldSize}
                onChange={(e) => setFieldSize(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="">Field Size</MenuItem>
                <MenuItem value="small">Small (18x8m)</MenuItem>
                <MenuItem value="medium">Medium (30-40x17-20m)</MenuItem>
                <MenuItem value="large">Large (45x60m)</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterControl}>
              <Select
                value={indoorOutdoor}
                onChange={(e) => setIndoorOutdoor(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="">Indoor/Outdoor</MenuItem>
                <MenuItem value="indoor">Indoor</MenuItem>
                <MenuItem value="outdoor">Outdoor</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterControl}>
              <Select
                value={floorType}
                onChange={(e) => setFloorType(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="">Floor Type</MenuItem>
                <MenuItem value="artificial">Artificial Turf</MenuItem>
                <MenuItem value="natural">Natural Grass</MenuItem>
                <MenuItem value="hard">Hard Court</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Container>

        {/* Fields List */}
        <Container maxWidth="lg">
          <Box className={styles.fieldsList}>
            {fields.map((venue) => (
              <Card key={venue.id} className={styles.venueCard}>
                <CardContent className={styles.venueCardContent}>
                  <Box className={styles.venueHeader}>
                    <Typography variant="h6" className={styles.venueName}>
                      {venue.venueName}
                    </Typography>
                    <Box className={styles.amenities}>
                      {venue.amenities.map((amenity, idx) => (
                        <Typography key={idx} variant="body2" className={styles.amenity}>
                          {amenity}
                          {idx < venue.amenities.length - 1 && " · "}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Box className={styles.fieldsContainer}>
                    {venue.fields.map((field) => (
                      <Card key={field.id} className={styles.fieldCard} component={Link} href={`/rental/${venue.id}/${field.id}`}>
                        <CardContent className={styles.fieldCardContent}>
                          <Box className={styles.fieldHeader}>
                            <Box className={styles.fieldInfo}>
                              <Typography variant="subtitle1" className={styles.fieldName}>
                                {field.name}
                              </Typography>
                              <Typography variant="body2" className={styles.fieldDetails}>
                                {field.size} • {field.indoorOutdoor} • {field.floorType}
                              </Typography>
                              <Typography variant="body1" className={styles.fieldPrice}>
                                {field.price}
                              </Typography>
                            </Box>
                            <Box className={styles.fieldImage}>
                              <Box className={styles.fieldImagePlaceholder} />
                            </Box>
                          </Box>

                          <Box className={styles.timeSlots}>
                            {field.timeSlots.map((slot, idx) => (
                              <Box
                                key={idx}
                                className={`${styles.timeSlot} ${slot.available ? styles.timeSlotAvailable : styles.timeSlotUnavailable}`}
                              >
                                {slot.time}
                              </Box>
                            ))}
                          </Box>

                          <Box className={styles.availabilityStatus}>
                            <Box className={styles.statusItem}>
                              <CheckCircleIcon className={styles.statusIconAvailable} />
                              <Typography variant="body2" className={styles.statusText}>
                                Available
                              </Typography>
                            </Box>
                            <Box className={styles.statusItem}>
                              <CancelIcon className={styles.statusIconUnavailable} />
                              <Typography variant="body2" className={styles.statusText}>
                                Unavailable
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Non-Partnered Fields Section */}
            <Card className={styles.nonPartneredCard} component={Link} href="/rental/non-partnered">
              <CardContent className={styles.nonPartneredContent}>
                <Typography variant="h6" className={styles.nonPartneredTitle}>
                  Non-Partnered Fields More
                </Typography>
                <Typography variant="body2" className={styles.nonPartneredSubtitle}>
                  Please check availability directly with the field.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
}

