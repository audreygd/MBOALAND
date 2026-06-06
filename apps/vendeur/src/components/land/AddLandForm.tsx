import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import SuccessDialog from "./SuccesDialogCreation";

type FullData = {
  name: string;
  location: string;
  surface: string;
  price: string;
  photos?: File[];
  documents?: File[];
};

export default function AddLandForm({
  currentStep = 0,
  onStepChange,
  onDataChange,
  onClose,
}: {
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onDataChange?: (data: FullData) => void;
  onClose?: () => void;
}) {
  const step = currentStep;
  const setStep = (s: number | ((prev: number) => number)) => {
    const newStep = typeof s === "function" ? s(step) : s;
    onStepChange?.(newStep);
  };
  const [data, setData] = useState<FullData>({
    name: "",
    location: "",
    surface: "",
    price: "",
    photos: [],
    documents: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDataChange = (
    patch: Partial<FullData> | ((prev: FullData) => Partial<FullData>),
  ) => {
    const actualPatch = typeof patch === "function" ? patch(data) : patch;
    const newData = { ...data, ...actualPatch };
    setData(newData);
    onDataChange?.(newData);
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!data.name) e.name = "Le nom est requis";
      if (!data.location) e.location = "La localisation est requise";
      if (!data.surface) e.surface = "La superficie est requise";
      if (!data.price) e.price = "Le prix est requis";
      if (data.surface && isNaN(Number(data.surface)))
        e.surface = "La superficie doit être un nombre";
      if (data.price && isNaN(Number(data.price)))
        e.price = "Le prix doit être un nombre";
    }
    if (s === 1) {
      if (!data.photos || data.photos.length === 0)
        e.photos = "Ajoutez au moins une photo";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(2, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setStep(0);
    setData({
      name: "",
      location: "",
      surface: "",
      price: "",
      photos: [],
      documents: [],
    });
    onClose?.();
    setOpenConfirmDialog(true);
    console.log(submitted);
  };

  return (
    <>
      <Box>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 700,
            textAlign: "center",
            color: "primary.main",
          }}
        >
          Ajouter un nouveau terrain
        </Typography>

        <Box>
          {step === 0 && (
            <Step1 data={data} errors={errors} onChange={handleDataChange} />
          )}

          {step === 1 && (
            <Step2 data={data} errors={errors} onChange={handleDataChange} />
          )}

          {step === 2 && <Step3 data={data} />}

          <Box
            sx={{ display: "flex", gap: 1, mt: 3, justifyContent: "flex-end" }}
          >
            {step > 0 && (
              <Button
                sx={{ borderRadius: 0.6, textTransform: "none" }}
                variant="outlined"
                onClick={prev}
              >
                Précédent
              </Button>
            )}

            {step < 2 && (
              <Button
                sx={{ borderRadius: 0.6, textTransform: "none" }}
                variant="contained"
                onClick={next}
              >
                Suivant
              </Button>
            )}

            {step === 2 && (
              <Button
                sx={{ borderRadius: 0.6, textTransform: "none" }}
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Soumettre
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      {openConfirmDialog && (
        <SuccessDialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        />
      )}
    </>
  );
}
