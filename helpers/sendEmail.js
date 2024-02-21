import sendgrid from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_API_KEY } = process.env;

sendgrid.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "mariashubna@gmail.com" };
  await sendgrid.send(email);
  return true;
};

export default sendEmail;