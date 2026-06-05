import { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardMedia,
} from "@mui/material";

import StatCard from "../components/StatCard";
import Row from "../components/Row";
import LandTable from "../components/LandTable";
import AddLandForm from "../components/land/AddLandForm";
import { MapIcon, SettingsIcon, TransactionIcon } from "../assets/icons";

type FormData = {
  name: string;
  location: string;
  surface: string;
  price: string;
  photos?: File[];
  documents?: File[];
};

export const LandPage = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData | null>(null);
  const steps = ["Informations", "Photos & Documents", "Validation"];
  return (
    <Box sx={{ bgcolor: "#f8fafc" }}>
      <Box
        sx={{
          position: "sticky",
          top: 104,
          bgcolor: "#f8fafc",
          py: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              borderColor: "#15803d",
              borderRadius: 0.5,
              px: 3,
              textTransform: "none",
              backgroundColor: "#15803d",
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "#fff" }}>
              Ajouter un terrain
            </Typography>
          </Button>
        </Box>
        {/* cards */}
        <Row
          sx={{
            gap: 4,
            p: 2,
            flex: 1,
            width: "100%",
          }}
          direction={"row"}
        >
          <Box sx={{ flex: 1 }}>
            <StatCard
              title=" Terrains en vente"
              value="5"
              color="#15803d"
              sx={{ width: "100%" }}
              icon={<SettingsIcon />}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="En attente"
              value="8"
              color="#2563eb"
              sx={{ width: "100%" }}
              icon={<TransactionIcon />}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="vendus"
              value="3"
              color="#d97706"
              sx={{ width: "100%" }}
              icon={<MapIcon />}
            />
          </Box>
        </Row>
      </Box>

      <Box sx={{ m: 2, overflow: "auto" }}>
        <Box>
          <LandTable />
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            height: "70vh",
          },
        }}
      >
        <DialogContent sx={{ p: 0, display: "flex", height: "100%" }}>
          {/* Stepper on the left */}
          <Box
            sx={{
              width: 220,
              borderRight: "1px solid #e5e7eb",
              p: 3,
              bgcolor: "#f9fafb",
              overflowY: "auto",
            }}
          >
            <Stepper activeStep={step} orientation="vertical" sx={{ mt: 8 }}>
              {steps.map((label, index) => (
                <Step key={label} completed={index < step}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Form on the right */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mt: 3,
            }}
          >
            <AddLandForm
              currentStep={step}
              onStepChange={setStep}
              onDataChange={setFormData}
              onClose={() => setOpen(false)}
            />

            {/* Image Preview Card */}
            {formData?.photos && formData.photos.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Aperçu des photos
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: 2,
                  }}
                >
                  {formData.photos.map((file, index) => (
                    <Card key={index} sx={{ height: 120, overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={URL.createObjectURL(file)}
                        alt={`Photo ${index + 1}`}
                        sx={{ objectFit: "cover" }}
                      />
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default LandPage;
