import axios from "axios";

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    maximumSignificantDigits: 2,
    style: "currency",
    currency: "USD",
  }).format(number);
}

export const getLocation = async (lokasi, kodeInduk) => {
  return await axios.get(
    `https://regions-indoneisa.herokuapp.com/api/${lokasi}?kode_induk=${kodeInduk}`
  );
};
