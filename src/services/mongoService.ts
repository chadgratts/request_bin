import { RawRequest, RequestBody } from "../config/db";

const storeRawRequest = async (request: string) => {
  const rawRequest = new RawRequest({ request });
  const savedRawRequest = await rawRequest.save();
  return savedRawRequest._id; // ObjectId
};

const storeRequestBody = async (body: string) => {
  const requestBody = new RequestBody({ body });
  const savedRequestBody = await requestBody.save();
  return savedRequestBody._id; // ObjectId
};

export { storeRawRequest, storeRequestBody };