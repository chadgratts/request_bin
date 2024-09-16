import { handleRequest } from "../services/requestService";

const captureRequest = async (req, res) => {
  // inspect subdomain, some other logic here

  // determine if the subdomain has a bin already here

  // needs updating
  let bin = true;
  if (bin) {
    await handleRequest(req);
    res.sendStatus(200);
  } else {
    // do something else if no bin
  }
};

export { captureRequest };