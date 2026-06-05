import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

type FullData = {
  name: string;
  location: string;
  surface: string;
  price: string;
  photos?: File[];
  documents?: File[];
};

export default function Step2({
  data,
  errors,
  onChange,
}: {
  data: FullData;
  errors?: Record<string, string>;
  onChange: Dispatch<SetStateAction<Partial<FullData>>>;
}) {
  const onFiles = (files: FileList | null, key: "photos" | "documents") => {
    if (!files) return;
    const arr = Array.from(files);
    onChange({ [key]: arr });
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
        Photos et Documents
      </Typography>
      <Box>
        <Button
          sx={{ borderRadius: 0.5, textTransform: "none" }}
          variant="outlined"
          component="label"
        >
          Télécharger une photo
          <input
            hidden
            multiple
            type="file"
            accept="image/*"
            onChange={(e) => onFiles(e.target.files, "photos")}
          />
        </Button>
        {errors?.photos && (
          <Box sx={{ color: "#b91c1c", mt: 1 }}>{errors.photos}</Box>
        )}
        <List>
          {(data.photos || []).map((f: File) => (
            <ListItem key={f.name}>
              <ListItemText
                primary={f.name}
                secondary={`${Math.round(f.size / 1024)} KB`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box>
        <Button
          sx={{ borderRadius: 0.6, textTransform: "none" }}
          variant="outlined"
          component="label"
        >
          Documents
          <input
            hidden
            multiple
            type="file"
            onChange={(e) => onFiles(e.target.files, "documents")}
          />
        </Button>
        <List>
          {(data.documents || []).map((f: File) => (
            <ListItem key={f.name}>
              <ListItemText
                primary={f.name}
                secondary={`${Math.round(f.size / 1024)} KB`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
