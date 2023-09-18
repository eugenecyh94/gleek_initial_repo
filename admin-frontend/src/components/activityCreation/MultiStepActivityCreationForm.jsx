// import {Controller, useForm} from "react-hook-form";
import {
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useCallback, useState, Fragment } from "react";
import { ACTIVITY_FORM_STEPS } from "../../utils/ActivityCreationFormSteps";
import ActivityType from "./creationStepsComponent/ActivityType";
import ActivityDetails from "./creationStepsComponent/ActivityDetails";

// //TODO - update to global store data
// const vendorStore = [
//    { companyName: 'Example Company',
//        id: '64fd63ff46a0da4fbc6ab434' },
// ];
//
// const vendorOptions = {
//     options: vendorStore.map((option) => option.companyName)
// };

const MultiStepActivityCreationForm = () => {
  // const { register, handleSubmit, reset, control, setValue } = useForm();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    console.log(event);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Stepper activeStep={activeStep}>
        {ACTIVITY_FORM_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          {activeStep === 0 && <ActivityType handleChange={handleChange} />}
          {activeStep === 1 && <ActivityDetails handleChange={handleChange} />}
          {activeStep === 2 && (
            <>
              <Typography variant="h6">Step 3</Typography>
              <TextField
                label="Phone"
                name="phone"
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === ACTIVITY_FORM_STEPS.length - 1}
          >
            {activeStep === ACTIVITY_FORM_STEPS.length - 1 ? "Submit" : "Next"}
          </Button>
          {activeStep > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBack}
              sx={{ marginLeft: 8 }}
            >
              Back
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );

  // return (
  // <form onSubmit={handleSubmit(onSubmit)}>
  //     <input type="text" ref={register} name="firstName" />
  // </form>
  // );
};

export default MultiStepActivityCreationForm;
