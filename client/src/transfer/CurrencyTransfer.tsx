import React, { useEffect, useState } from "react";
import classes from "./CurrencyTransfer.module.css";
import transferIcon from "../assets/converter-icon.png";
import reverseIcon from "../assets/converter-swap-icon.png";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { numberToString } from "../util";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

const APP_ID = "4a10fc1d1b2b439fbc62cb2ae5088124";

const roundNumber2 = (num: number) => {
  return Math.round(num * 100) / 100;
};

const roundNumber6 = (num: number) => {
  return Math.round(num * 1000000) / 1000000;
};

const calRateMask = (rate: number) => roundNumber6((rate * 100) / 101);

const CurrencyTransfer = () => {
  const [curList, setCurList] = useState([""]);

  const [curFrom, setCurFrom] = useState("");
  const [moneyFrom, setMoneyFrom] = useState(100);
  const [focusingFrom, setFocusingFrom] = useState(false);
  const [EditingFrom, setEditingFrom] = useState(false);

  const [curTo, setCurTo] = useState("");
  const [moneyTo, setMoneyTo] = useState(0);
  const [focusingTo, setFocusingTo] = useState(false);
  const [EditingTo, setEditingTo] = useState(false);

  const [isCalculatingTo, setIsCalculatingTo] = useState(true);
  const [rateMap, setRateMap] = useState(new Map());
  const [rate, setRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [snackBar, setSnakBar] = useState({
    open: false,
    message: "",
  });
  const navigate = useNavigate();

  const rate_Mask: number = calRateMask(rate);
  const fee = isCalculatingTo
    ? roundNumber2(moneyTo / 100)
    : roundNumber2(moneyFrom / 101);
  let fee_Presnt: string = fee + " " + (isCalculatingTo ? curTo : curFrom);

  useEffect(() => {
    fetch("https://openexchangerates.org/api/latest.json?app_id=" + APP_ID)
      .then((res) => res.json())
      .then((data) => {
        const rates = data.rates;
        setCurList(Object.keys(rates));
        const rateMap = new Map(Object.entries(rates));
        setRateMap(rateMap);
        setCurFrom("EUR");
        setCurTo("USD");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    calRate();
  }, [curFrom, curTo]);

  useEffect(() => {
    calMoneyTo(moneyFrom);
  }, [rate]);

  useEffect(() => {}, [moneyFrom]);

  const styles = {
    select: {
      ".MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      ".MuiSelect-select": {
        padding: "0 70px 0 16px !important",
        fontWeight: "bold",
        color: "#012754",
      },
    },
  };

  const updMoneyFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    const moneyFrom = Number(value);
    calMoneyTo(moneyFrom);
  };

  const calMoneyTo = (moneyFrom: number) => {
    setIsCalculatingTo(true);
    setMoneyFrom(roundNumber2(moneyFrom));
    const moneyTo_Mask = roundNumber6(moneyFrom * rate_Mask);
    setMoneyTo(roundNumber2(moneyTo_Mask));
  };

  const updMoneyTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    const moneyTo = Number(value);
    calMoneyFrom(moneyTo);
  };

  const calMoneyFrom = (moneyTo: number) => {
    setIsCalculatingTo(false);
    setMoneyTo(roundNumber2(moneyTo));
    const moneyFrom_Mask = moneyTo / rate_Mask;
    setMoneyFrom(roundNumber2(moneyFrom_Mask));
  };

  const reverseCur = () => {
    const curFromSnapShot = curFrom;
    const curToSnapShot = curTo;
    setCurFrom(curToSnapShot);
    setCurTo(curFromSnapShot);
  };

  const calRate = () => {
    if (rateMap.size === 0) return;
    let rate = rateMap.get(curTo) / rateMap.get(curFrom);
    rate = roundNumber6(rate);
    setRate(rate);
  };

  const calMask_From = (moneyFrom: number, moneyTo: number) => {
    const fee = moneyFrom / 100;
    const moneyFrom_prcsd = moneyFrom + fee;
    const rate_Procsd = moneyTo / moneyFrom_prcsd;
    return {
      moneyFrom_prcsd,
      rate_Procsd,
      fee,
    };
  };

  const submit = () => {
    fetch(
      process.env.REACT_APP_SERVER_URL +
        `/general/add?moneyFrom=${moneyFrom}&moneyTo=${moneyTo}&curFrom=${curFrom}` +
        `&curTo=${curTo}&isBuyingTo=${isCalculatingTo}&fee=${fee}`
    )
      .then((res) => {
        setSnakBar({
          open: true,
          message: "Transaction Successfully Added",
        });
      })
      .catch((err) => {
        setSnakBar({
          open: true,
          message: err,
        });
      });
  };

  const handleSnackBarClose = () => {
    setSnakBar({
      open: false,
      message: "",
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes["transfer-card"]}>
        <div className={classes.heading}>
          <img src={transferIcon}></img>
          <div className={classes.title}>
            <p>Currency</p>
            <p>Transfer</p>
          </div>
        </div>
        <div
          className={classes["transfer-form"]}
          style={{ marginTop: "2.5rem" }}
        >
          <span className={classes.label}>From</span>
          <Select
            sx={styles.select}
            value={curFrom}
            onChange={(e) => setCurFrom(e.target.value)}
          >
            {curList.map((cur) => (
              <MenuItem key={cur} value={cur}>
                {cur}
              </MenuItem>
            ))}
          </Select>
          <Divider
            className={classes.divider}
            orientation="vertical"
            flexItem
          />
          <div
            onFocus={() => setEditingFrom(true)}
            onBlur={() => {
              setEditingFrom(false);
            }}
            onMouseEnter={() => setFocusingFrom(true)}
            onMouseLeave={() => setFocusingFrom(false)}
          >
            {(focusingFrom || EditingFrom) && (
              <input
                type="number"
                className={classes["money-input"]}
                value={moneyFrom}
                onChange={(e) => {
                  updMoneyFrom(e);
                }}
              ></input>
            )}
            {!focusingFrom && !EditingFrom && (
              <input
                readOnly
                className={classes["money-show"]}
                value={numberToString(moneyFrom)}
              ></input>
            )}
          </div>
        </div>
        <div className={classes.reverse} onClick={() => reverseCur()}>
          <img src={reverseIcon}></img>
        </div>
        <div className={classes["transfer-form"]}>
          <span className={classes.label}>To</span>
          <Select
            value={curTo}
            sx={styles.select}
            onChange={(e) => setCurTo(e.target.value)}
          >
            {curList.map((cur) => (
              <MenuItem key={cur} value={cur}>
                {cur}
              </MenuItem>
            ))}
          </Select>
          <Divider
            className={classes.divider}
            orientation="vertical"
            flexItem
          />
          <div
            onFocus={() => setEditingTo(true)}
            onBlur={() => setEditingTo(false)}
            onMouseEnter={() => setFocusingTo(true)}
            onMouseLeave={() => setFocusingTo(false)}
          >
            {(focusingTo || EditingTo) && (
              <input
                type="number"
                className={classes["money-input"]}
                value={moneyTo}
                onChange={(e) => {
                  updMoneyTo(e);
                }}
              ></input>
            )}
            {!focusingTo && !EditingTo && (
              <input
                readOnly
                className={classes["money-show"]}
                value={numberToString(moneyTo)}
              ></input>
            )}
          </div>
          {/* <div className={classes["money-input"]}>asdas</div> */}
        </div>
        <div className={classes.description}>
          <p>Market Rate: {rate_Mask}</p>
          <p>Fee: {fee_Presnt}</p>
        </div>
        <div className={classes.submit}>
          <Button variant="contained" onClick={submit}>
            Submit
          </Button>
        </div>
        {isLoading && (
          <div className={classes.backdrop}>
            <CircularProgress />
          </div>
        )}
      </div>

      <Button
        variant="contained"
        // color="success"
        onClick={() => {
          navigate("/transactions");
        }}
      >
        Back
      </Button>
      <Snackbar
        open={snackBar.open}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        message={snackBar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
};

export default CurrencyTransfer;
