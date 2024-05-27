import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import "./styles.css";

interface IMassage {
 [key: string]: string
}

interface ICurrencyInfo {
  price: string | null;
  time: string | null;
}

interface IRealTimePriceProps {
  currency: string;
}
const RealTimePrice = ({ currency }: IRealTimePriceProps) => {
  const [currencyInfo, setCurrencyInfo] = useState<ICurrencyInfo | null>(null);

  const { sendMessage, lastJsonMessage, readyState   } = useWebSocket(
    "wss://ws.coinapi.io/v1/",
    {
      onOpen: () => {
        sendMessage(
          JSON.stringify({
            type: "hello",
            apikey: "33E76C4F-9B5C-49BD-BE77-FFFBE2FD8395",
            subscribe_data_type: ["trade"],
            subscribe_filter_symbol_id: [`BITSTAMP_SPOT_${currency}$`],
          }),
        );
      },
      onMessage: (message) =>
        setCurrencyInfo({
          price: message.data.price,
          time: message.data.time_exchange,
        }),
    },
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setCurrencyInfo({
        price: (lastJsonMessage as IMassage)?.price,
        time: (lastJsonMessage as IMassage)?.time_exchange,
      });
    }
  }, [lastJsonMessage]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (readyState > 0) {
      sendMessage(
        JSON.stringify({
          type: "subscribe",
          apikey: "33E76C4F-9B5C-49BD-BE77-FFFBE2FD8395",
          subscribe_data_type: ["trade"],
          subscribe_filter_symbol_id: [`BITSTAMP_SPOT_${currency}$`],
        }),
      );
    }
    return () => {
      if (readyState > 0) {
        sendMessage(
          JSON.stringify({
            type: "unsubscribe",
            apikey: "33E76C4F-9B5C-49BD-BE77-FFFBE2FD8395",
            subscribe_data_type: ["trade"],
            subscribe_filter_symbol_id: [`BITSTAMP_SPOT_${currency}$`],
          }),
        );
      }
      setCurrencyInfo({ price: null, time: null });
    };
  }, [currency]);


  return (
    <div className="realTimePriceWrapper">
      <div className="data-item">
        <div>Symbol:</div>
        <div>{currency.split("_").join("/")}</div>
      </div>
      <div className="data-item">
        <div>Price:</div>
        <div>
          {currencyInfo?.price ?`$${currencyInfo?.price}` : "Loading..."}
        </div>
      </div>
      <div className="data-item">
        <div>Time:</div>
        <div>
          {currencyInfo?.time
            ? new Date(currencyInfo?.time).toLocaleString()
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};

export default RealTimePrice;
