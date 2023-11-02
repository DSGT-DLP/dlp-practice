import React, { useState } from "react";

import NavbarMain from "@/common/components/NavBarMain";
import Footer from "@/common/components/Footer";
import { Box, Button, Text } from "gestalt";
import { useGetBeginnerMessageQuery } from "@/features/Beginner/beginnerApi";

const Beginner = () => {
    const { data, isLoading, refetch } = useGetBeginnerMessageQuery();

    const [isVisible, setIsVisible] = useState(false);

    const updateAndDisplay = () => {
        refetch();
        setIsVisible(true);
    };

    return(
        <>
        <NavbarMain />
        <div className="flex-wrapper">
        <Box
        alignItems="center"
        alignSelf="center"
        margin="auto"
        height="100%"
        justifyContent="center"
        width="100%"
        >
            <Button size="lg" text="Message the Server" onClick={updateAndDisplay}/>

        </Box>
        <Box
            display={isVisible ? "block" : "none"}
        >
            <Text>
                    {data}
            </Text>
        </Box>
        </div>
        <Footer />
        </>
    );
};

export default Beginner;
