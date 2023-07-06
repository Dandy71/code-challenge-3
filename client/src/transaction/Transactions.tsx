import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Transaction } from "./model/Transaction";
import { numberToString } from "../util";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsloading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_URL + "/general/get")
      .then((res) => res.json())
      .then((data) => {
        setIsloading(false);
        const transactions = data.rows.map((row: any) => {
          return new Transaction({
            id: row.ID,
            moneyFrom: row.MoneyFrom,
            moneyTo: row.MoneyTo,
            curFrom: row.CurFrom,
            curTo: row.CurTo,
            isBuyingTo: row.isBuyingTo,
            fee: row.Fee,
            create_time: row.Create_Time,
          });
        });
        setTransactions(transactions);
      });
  }, []);

  const columns = [
    {
      field: "symbol",
      headerName: "Symbol",
      flex: 1,
    },
    {
      field: "moneyFrom",
      headerName: "Source Amount",
      flex: 1,
      renderCell: (params: any) => {
        return numberToString(params.value);
      },
    },
    {
      field: "moneyTo",
      headerName: "Target Amount",
      flex: 1,
      renderCell: (params: any) => {
        return numberToString(params.value);
      },
    },
    {
      field: "feePresnt",
      headerName: "Fee",
      flex: 1,
    },
    {
      field: "create_time",
      headerName: "Create At",
      flex: 1,
      renderCell: (params: any) => {
        return new Date(params.value).toLocaleString();
      },
    },
  ];

  const styles = {
    ".MuiDataGrid-columnHeaderTitle": {
      fontWeight: "600",
    },
  };

  return (
    <Box margin="0 auto" width="1080px">
      <Box
        height="max(75vh,500px)"
        m="1.5rem 2.5rem"
        sx={{ backgroundColor: "white", borderRadius: "10px" }}
      >
        <DataGrid
          loading={isLoading}
          columns={columns}
          rows={transactions}
          getRowId={(row) => row.id}
          pageSizeOptions={[20, 50, 100]}
          initialState={{
            sorting: {
              sortModel: [{ field: "create_time", sort: "desc" }],
            },
          }}
          sx={styles}
        />
      </Box>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/transfer");
        }}
      >
        New Transaction
      </Button>
    </Box>
  );
};

export default Transactions;
