import NavbarMain from "@/common/components/NavBarMain";
import { backendApi } from "@/common/redux/backendApi";
import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const countValueInArr = (arr: number[], val: number) => {
  return arr.reduce((acc: number, currVal: number) => {
    if (currVal === val) return 1 + acc;
    return acc;
  }, 0);
};

const Andrew = () => {
  const { data } = backendApi.useGetDatasetByNameQuery("IRIS");
  if (!data) return;
  const targetArr = Object.values(data.data.target);
  const setosaCount = countValueInArr(targetArr, 0);
  const versicolorCount = countValueInArr(targetArr, 1);
  const virginicaCount = countValueInArr(targetArr, 2);

  return (
    <>
      <NavbarMain />
      <div id="header-section">
        <h1 className="header">Hello</h1>
      </div>
      <div>
        <div>Pie chart of the frequency of species in the iris dataset</div>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: setosaCount, label: "Setosa" },
                { id: 1, value: versicolorCount, label: "Versicolor" },
                { id: 2, value: virginicaCount, label: "Virginica" },
              ],
            },
          ]}
          width={400}
          height={200}
        />
      </div>
    </>
  );
};

export default Andrew;
