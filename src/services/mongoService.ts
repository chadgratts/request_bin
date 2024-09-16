import RawRequest from "../models/rawRequest";
import RequestBody from "../models/requestBody";

const storeRawRequest = async (request_raw: string) => {
  const rawRequest = new RawRequest({ request_raw });
  const savedRawRequest = await rawRequest.save();
  return savedRawRequest._id; // ObjectId
};

const storeRequestBody = async (request_body: string) => {
  const requestBody = new RequestBody({ request_body });
  const savedRequestBody = await requestBody.save();
  return savedRequestBody._id; // ObjectId
};

// fetchRawRequest

// fetchRequestBody

export { storeRawRequest, storeRequestBody };