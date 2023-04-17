import { Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BaseTrainspaceData,
  DATA_SOURCE,
  DATA_SOURCE_ARR,
} from "../types/trainTypes";
import { useAppDispatch } from "@/common/redux/hooks";
import { useRouter } from "next/router";
import { setTrainspace } from "../redux/trainspaceSlice";
import startCase from "lodash.startcase";
import camelCase from "lodash.camelcase";
const CreateTrainspace = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    setValue,
  } = useForm<BaseTrainspaceData>({
    defaultValues: {
      name: "My Trainspace",
    },
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const onSubmit = handleSubmit((data: BaseTrainspaceData) => {
    console.log(data);
    dispatch(setTrainspace(data));
  });
  useEffect(() => {
    if (router.isReady && router.query.source) {
      setValue("dataSource", router.query.source as DATA_SOURCE);
    }
  }, [router.isReady]);
  return (
    <Grid
      container
      spacing={5}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <Typography variant="h1" fontSize={50}>
          Create a Trainspace
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          id="filled-basic"
          label="Name"
          variant="filled"
          required
          helperText={errors.name ? "Name is required" : ""}
          error={errors.name ? true : false}
          style={{ width: "500px" }}
          {...register("name", { required: true })}
        />
      </Grid>
      <Grid item>
        <Controller
          name="dataSource"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextField
              select
              label="Data Source"
              sx={{ m: 1, minWidth: 300 }}
              size="medium"
              required
              defaultValue={""}
              error={errors.dataSource ? true : false}
              onChange={(e) => onChange(e.target.value)}
              value={value ?? ""}
              helperText={errors.dataSource ? "Data Source is required" : ""}
            >
              {DATA_SOURCE_ARR.map((source) => (
                <MenuItem key={source} value={source}>
                  {source === "CLASSICAL_ML"
                    ? "Classical ML"
                    : startCase(camelCase(source))}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={onSubmit}>
          Create
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateTrainspace;