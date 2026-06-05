import { Box } from "@mui/material";
import AddLandForm from "../components/land/AddLandForm";

const AddLandPage = () => {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "80vh", p: 2 }}>
      <AddLandForm />
    </Box>
  );
};

export default AddLandPage;
