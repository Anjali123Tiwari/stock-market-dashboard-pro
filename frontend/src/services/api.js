
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getCompanies(){
  const {data} = await axios.get(`${API}/companies`);
  return data;
}
export async function getStock(ticker, period="6mo"){
  const {data} = await axios.get(`${API}/stocks/${ticker}`, { params: { period } });
  return data;
}
export async function getStats(ticker){
  const {data} = await axios.get(`${API}/stats/${ticker}`);
  return data;
}
export async function getPrediction(ticker){
  const {data} = await axios.get(`${API}/predict/${ticker}`);
  return data;
}
