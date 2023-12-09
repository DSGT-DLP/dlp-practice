import React from "react";
import { Button, colors } from "@mui/material";
import { backendApi } from "@/common/redux/backendApi";

const useBeginnerApi = () => {
    const [trigger, result] = backendApi.useLazyGetBeginnerMessageQuery();
  
    const fetchBeginnerMessage = () => {
      trigger();
    };
  
    return { fetchBeginnerMessage, result };
  };
  
  const Beginner = () => {
    const { fetchBeginnerMessage, result } = useBeginnerApi();
  
    return (
      <div>
        <Button onClick={fetchBeginnerMessage} style={{backgroundColor: "blue", color: "white"}}>Click on me</Button>
        {result.data && <div>{result.data.result}</div>}
      </div>
    );
  };
  
  export default Beginner;