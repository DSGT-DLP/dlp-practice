import { backendApi } from "@/common/redux/backendApi";
import { Button } from "@mui/material";
import React from "react";

const Beginner = () => {
  const [trigger, result] = backendApi.useLazyGetBeginnerMessageQuery();

  return (
    <>
      <div>Beginner page</div>
      <Button onClick={() => trigger()}>Click on me</Button>
      {result.data && <div>The backend returned: {result.data.result}</div>}
    </>
  );
};

export default Beginner;
