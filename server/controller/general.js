import { connection } from "../index.js";

export const addTransaction = (req, res) => {
  try {
    const { moneyFrom, moneyTo, curFrom, curTo, isBuyingTo, fee } = req.query;
    if (!connection._connectCalled) {
      connection.connect();
    }

    const query =
      `insert into TRANSACTIONS (moneyFrom,moneyTo,curFrom,curTo,isBuyingto,fee)` +
      `values (${moneyFrom},${moneyTo},"${curFrom}","${curTo}",${isBuyingTo},${fee});`;
    connection.query(query);

    // connection.end();

    res.status(200).json({ info: "successfully added" });
  } catch (error) {
    res.status(404).json({ message: "fail to add" });
  }
};

export const getTransactions = (req, res) => {
  try {
    if (!connection._connectCalled) {
      connection.connect();
    }
    const query = `select * from TRANSACTIONS`;
    connection.query(query, (err, rows, fields) => {
      if (err) throw err;
      res.status(200).json({ rows });
    });
    // connection.end();
    // res.status(200).json({ info: "successfully added" });
  } catch (error) {
    res.status(404).json({ message: "fail to add" });
  }
};
