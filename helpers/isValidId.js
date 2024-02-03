import { Types } from "mongoose";
import {HttpError} from "./HttpError.js";

const isIdValid = () => {
  const validId = (req, _, next) => {
    const id = req.params.id;
    const isIdValid = Types.ObjectId.isValid(id);

    if (!isIdValid) {
      throw HttpError(400, `${id} is not valid`);
    }

    next();
  };

  return validId;
};

export default isIdValid;