const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const routes = require("./routes");
const db = require("./models");

const LastBlock = require("./models/block");
const LastTransaction = require("./models/transaction");

const Web3 = require("web3");
const web3 = new Web3("http://localhost:8088");
const WsWeb3 = new Web3.providers.WebsocketProvider("ws://localhost:8082");

web3.eth.subscribe("newBlockHeaders", (err, result) => {
  if (!err) {
    db.LastBlock.max("number").then(async () => {
      DBLastBlockNumBer = await LastBlock.max("blockNumber");
      LastBlockNumBer = (await web3.eth.getBlock("latest")).number;
      if (LastBlockNumBer > DBLastBlockNumBer) {
        await web3.eth.getBlockNumber(async function (err, rtn) {
          let LastBlockNumBer = await rtn;
          for (let i = 0; i <= LastBlockNumBer; i++) {
            const LastBlockInfo = await web3.eth.getBlock(i);
            await LastBlock.create({
              difficulty: LastBlockInfo.difficulty,
              extraData: LastBlockInfo.extraData,
              gasLimit: LastBlockInfo.gasLimit,
              gasUsed: LastBlockInfo.gasUsed,
              hash: LastBlockInfo.hash,
              nonce: LastBlockInfo.nonce,
              blockNumber: LastBlockInfo.number,
              parenthash: LastBlockInfo.parenthash,
              size: LastBlockInfo.size,
              timestamps: LastBlockInfo.timestamps,
              totaldifficulty: LastBlockInfo.totaldifficulty,
              transactionsroot: LastBlockInfo.transactionsroot,
              transactions: LastBlockInfo.transactions,
            });
          }
          await web3.eth.getBlockNumber(async (err, rtn) => {
            for (let i = 0; i <= rtn; i++) {
              await web3.eth.getBlockTransactionCount(
                i,
                true,
                async (err, cnt) => {
                  if (cnt > 0) {
                    for (let j = 0; j < cnt; j++) {
                      await web3.eth.getTransactionFromBlock(
                        i,
                        j,
                        async (err, tx) => {
                          const tempBlock = await db.LastBlock.findOne({
                            where: { blockNumber: tx.blockNumber },
                          });
                          const checkTx = await db.LastTransaction.findOne({
                            where: { blockHeight: tempBlock.blockNumber },
                          });
                          if (!checkTx) {
                            const txAdd = await db.LastTransaction.create({
                              transactionHash: tx.blockHash,
                              blockHeight: tx.blockNumber,
                              from: tx.from,
                              to: tx.to,
                              hash: tx.hash,
                              nonce: tx.nonce,
                              transactionIndex: tx.transactionIndex,
                              value: tx.value,
                              r: tx.r,
                              s: tx.s,
                              v: tx.v,
                            });
                            tempBlock.addTransaction(txAdd);
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          });
        });
        res.send({ isError: false });
      } else {
        console.log("???????????? ??? LastBlockNumBer??? ??? ?????????. ????????????");
      }
    });
  }
});

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/", express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "seed",
  })
);
app.use("/api", routes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.post("/", async (req, res) => {
  // Last Block DB ??????
  let LastBlockNumBer = 0;
  let DBLastBlockNumBer = 0;

  try {
    DBLastBlockNumBer = await LastBlock.max("blockNumber");
    LastBlockNumBer = (await web3.eth.getBlock("latest")).number;

    if (LastBlockNumBer > DBLastBlockNumBer) {
      await web3.eth.getBlockNumber(async function (err, rtn) {
        let LastBlockNumBer = await rtn;

        for (let i = 0; i <= LastBlockNumBer; i++) {
          const LastBlockInfo = await web3.eth.getBlock(i);
          await LastBlock.create({
            difficulty: LastBlockInfo.difficulty,
            extraData: LastBlockInfo.extraData,
            gasLimit: LastBlockInfo.gasLimit,
            gasUsed: LastBlockInfo.gasUsed,
            hash: LastBlockInfo.hash,
            nonce: LastBlockInfo.nonce,
            blockNumber: LastBlockInfo.number,
            parenthash: LastBlockInfo.parenthash,
            size: LastBlockInfo.size,
            timestamps: LastBlockInfo.timestamps,
            totaldifficulty: LastBlockInfo.totaldifficulty,
            transactionsroot: LastBlockInfo.transactionsroot,
            transactions: LastBlockInfo.transactions,
          });
          console.log("LastBlockInfo:", LastBlockInfo);
        }

        await web3.eth.getBlockNumber(async (err, rtn) => {
          for (let i = 0; i <= rtn; i++) {
            await web3.eth.getBlockTransactionCount(
              i,
              true,
              async (err, cnt) => {
                if (cnt > 0) {
                  for (let j = 0; j < cnt; j++) {
                    await web3.eth.getTransactionFromBlock(
                      i,
                      j,
                      async (err, tx) => {
                        const tempBlock = await db.LastBlock.findOne({
                          where: { blockNumber: tx.blockNumber },
                        });

                        const checkTx = await db.LastTransaction.findOne({
                          where: { blockHeight: tempBlock.blockNumber },
                        });

                        if (!checkTx) {
                          const txAdd = await db.LastTransaction.create({
                            transactionHash: tx.blockHash,
                            blockHeight: tx.blockNumber,
                            from: tx.from,
                            to: tx.to,
                            hash: tx.hash,
                            nonce: tx.nonce,
                            transactionIndex: tx.transactionIndex,
                            value: tx.value,
                            r: tx.r,
                            s: tx.s,
                            v: tx.v,
                          });
                          tempBlock.addTransaction(txAdd);
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        });
      });

      res.send({ isError: false });
    } else {
      console.log("???????????? ??? LastBlockNumBer??? ??? ?????????. ????????????");
    }
  } catch (error) {
    res.send({ isError: true });
  }
});

app.listen(8080, () => {
  console.log(8080 + " server start");
});
